from fastapi import APIRouter, Depends, Query, Request
from sqlmodel import Session
from typing import List, Optional
import uuid

from backend.config.database import get_session
from backend.models.comment import Comment, CommentCreate, CommentRead, CommentUpdate
from backend.services.comment_service import CommentService
from backend.middleware import require_auth, get_current_user
from backend.utils import NotFoundError


router = APIRouter(tags=["comments"])


@router.post("/posts/{post_id}/comments", response_model=CommentRead)
async def create_comment(
    post_id: uuid.UUID,
    comment_data: CommentCreate,
    request: Request,
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    """Create a new comment for a post."""
    comment_service = CommentService(session)
    
    # Get client IP
    client_ip = request.client.host if request.client else None
    
    comment = comment_service.create_comment(
        post_id=post_id,
        comment_data=comment_data,
        user_id=current_user.id if current_user else None,
        ip_address=client_ip
    )
    return comment


@router.get("/posts/{post_id}/comments", response_model=List[CommentRead])
async def list_post_comments(
    post_id: uuid.UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    session: Session = Depends(get_session)
):
    """List comments for a post."""
    comment_service = CommentService(session)
    comments = comment_service.list_post_comments(post_id, skip, limit)
    return comments


@router.put("/comments/{comment_id}", response_model=CommentRead)
async def update_comment(
    comment_id: uuid.UUID,
    comment_data: CommentUpdate,
    session: Session = Depends(get_session),
    current_user = Depends(require_auth)
):
    """Update comment (author only)."""
    comment_service = CommentService(session)
    comment = comment_service.update_comment(comment_id, comment_data, current_user.id)
    return comment


@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user = Depends(require_auth)
):
    """Delete comment (author only)."""
    comment_service = CommentService(session)
    comment_service.delete_comment(comment_id, current_user.id)
    return {"message": "Comment deleted successfully"}
