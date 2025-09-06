from fastapi import APIRouter, Depends, Query, Request
from sqlmodel import Session
from typing import List, Optional
import uuid

from backend.config.database import get_session
from backend.models.engagement import Like, LikeCreate, LikeRead
from backend.services.like_service import LikeService
from backend.middleware import require_auth, get_current_user
from backend.utils import NotFoundError


router = APIRouter(tags=["likes"])


@router.post("/posts/{post_id}/likes", response_model=LikeRead)
async def create_like(
    post_id: uuid.UUID,
    like_data: LikeCreate,
    request: Request,
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    """Like a post."""
    like_service = LikeService(session)
    
    # Get client IP
    client_ip = request.client.host if request.client else None
    
    like = like_service.create_like(
        post_id=post_id,
        like_data=like_data,
        user_id=current_user.id if current_user else None,
        ip_address=client_ip
    )
    return like


@router.delete("/posts/{post_id}/likes")
async def delete_like(
    post_id: uuid.UUID,
    request: Request,
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    """Unlike a post."""
    like_service = LikeService(session)
    
    # Get client IP
    client_ip = request.client.host if request.client else None
    
    like_service.delete_like(
        post_id=post_id,
        user_id=current_user.id if current_user else None,
        ip_address=client_ip
    )
    return {"message": "Like removed successfully"}


@router.get("/posts/{post_id}/likes", response_model=List[LikeRead])
async def list_post_likes(
    post_id: uuid.UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    session: Session = Depends(get_session)
):
    """List who liked a post."""
    like_service = LikeService(session)
    likes = like_service.get_post_likes(post_id, skip, limit)
    return likes
