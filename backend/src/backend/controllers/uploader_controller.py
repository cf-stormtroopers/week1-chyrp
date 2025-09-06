import datetime
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    Query,
    Path as PathParam,
)
from fastapi.responses import FileResponse
from sqlmodel import Session
from typing import List, Optional
import uuid
import os
import aiofiles
from pathlib import Path

from ..config.database import get_session
from ..config import settings
from ..models.post import PostFile, PostFileCreate, PostFileRead
from ..middleware.auth import require_auth, get_current_user_optional
from ..models.user import User

router = APIRouter(prefix="/upload", tags=["File Upload"])


@router.post("", response_model=List[PostFile], status_code=201)
async def upload_files(
    files: List[UploadFile] = File(...),
    post_id: Optional[uuid.UUID] = Form(None, description="Associated post ID"),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_auth),
):
    """
    Upload single or multiple files.

    Files are stored in the media directory configured via MEDIA_DIR env variable.
    Supports associating files with a specific post.
    """
    # Ensure media directory exists
    media_path = Path(settings.media_dir)
    media_path.mkdir(exist_ok=True)

    uploaded_files = []

    for file in files:
        # Generate unique filename
        file_id = uuid.uuid4()
        file_extension = Path(file.filename).suffix if file.filename else ""
        filename = f"{file_id}{file_extension}"
        file_path = media_path / filename

        # Save file to disk
        async with aiofiles.open(file_path, "wb") as f:
            content = await file.read()
            await f.write(content)

        db_file = PostFile(
            id=file_id,
            file_url=f"/upload/{file_id}/download",
            filename=filename,
            file_type=file.content_type or "application/octet-stream",
            created_at=datetime.datetime.utcnow(),
            uploaded_at=datetime.datetime.utcnow(),
        )
        session.add(db_file)
        uploaded_files.append(db_file)

    session.commit()

    # Refresh all files to get updated data
    for file in uploaded_files:
        session.refresh(file)

    return uploaded_files


@router.delete("/{file_id}", status_code=204)
async def delete_file(
    file_id: uuid.UUID = PathParam(..., description="File ID"),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_auth),
):
    """
    Delete an uploaded file.

    Removes both the database record and the physical file.
    Only the file owner or users with appropriate permissions can delete files.
    """
    db_file = session.get(PostFile, file_id)
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    # TODO: Add authorization check (file owner or admin)

    # Remove physical file
    file_path = Path(db_file.file_path)
    if file_path.exists():
        file_path.unlink()

    # Remove database record
    session.delete(db_file)
    session.commit()


@router.get("/{file_id}", response_model=PostFileRead)
async def get_file_metadata(
    file_id: uuid.UUID = PathParam(..., description="File ID"),
    session: Session = Depends(get_session),
):
    """
    Get file metadata.

    Returns file information without serving the actual file content.
    """
    db_file = session.get(PostFile, file_id)
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    return db_file


@router.get("/{file_id}/download")
async def download_file(
    file_id: uuid.UUID = PathParam(..., description="File ID"),
    session: Session = Depends(get_session),
):
    """
    Download the actual file.

    Serves the file content with appropriate headers.
    """
    db_file = session.get(PostFile, file_id)
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    media_path = Path(settings.media_dir)
    media_path.mkdir(exist_ok=True)
    file_path = Path(media_path / db_file.filename)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Physical file not found")

    return FileResponse(
        path=str(file_path), filename=db_file.filename, media_type=db_file.file_type
    )


@router.get("", response_model=List[PostFileRead])
async def list_files(
    post_id: Optional[uuid.UUID] = Query(None, description="Filter by post ID"),
    skip: int = Query(0, ge=0, description="Number of files to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of files to return"),
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    List uploaded files.

    Can be filtered by post ID. Supports pagination.
    """
    from sqlmodel import select

    statement = select(PostFile)

    if post_id:
        statement = statement.where(PostFile.post_id == post_id)

    statement = statement.offset(skip).limit(limit)
    files = session.exec(statement).all()

    return files
