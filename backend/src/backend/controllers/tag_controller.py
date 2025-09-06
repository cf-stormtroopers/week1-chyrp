from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from typing import List, Optional

from backend.config.database import get_session
from backend.models.taxonomy import Tag, TagCreate, TagRead
from backend.services.tag_service import TagService
from backend.middleware import require_auth, get_current_user
from backend.utils import NotFoundError


router = APIRouter(prefix="/tags", tags=["tags"])


@router.post("/", response_model=TagRead)
async def create_tag(
    tag_data: TagCreate,
    session: Session = Depends(get_session),
    current_user = Depends(require_auth)
):
    """Create a new tag."""
    tag_service = TagService(session)
    tag = tag_service.create_tag(tag_data)
    return tag


@router.get("/", response_model=List[TagRead])
async def list_tags(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None),
    session: Session = Depends(get_session)
):
    """List all tags with pagination and optional search."""
    tag_service = TagService(session)
    tags = tag_service.list_tags(skip=skip, limit=limit, search=search)
    return tags


@router.delete("/{tag_id}")
async def delete_tag(
    tag_id: int,
    session: Session = Depends(get_session),
    current_user = Depends(require_auth)
):
    """Delete tag (authenticated users only)."""
    tag_service = TagService(session)
    tag_service.delete_tag(tag_id)
    return {"message": "Tag deleted successfully"}
