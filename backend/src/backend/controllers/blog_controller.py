from fastapi import APIRouter, Depends, HTTPException, Query, Path as PathParam
from sqlmodel import Session
from typing import List, Optional
import uuid

from ..config.database import get_session
from ..models.post import Post, PostRead, PostCreate, PostUpdate
from ..services.blog_service import BlogService
from ..middleware.auth import get_current_user_optional, require_auth
from ..models.user import User

router = APIRouter(
    prefix="/posts",
    tags=["Blog Posts"]
)


@router.get("", response_model=List[PostRead])
async def list_posts(
    skip: int = Query(0, ge=0, description="Number of posts to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of posts to return"),
    category: Optional[str] = Query(None, description="Filter by category slug"),
    tag: Optional[str] = Query(None, description="Filter by tag slug"),
    search: Optional[str] = Query(None, description="Search in title and content"),
    status: Optional[str] = Query(None, description="Filter by post status"),
    author_id: Optional[uuid.UUID] = Query(None, description="Filter by author ID"),
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    List all posts with pagination and filtering.
    
    Returns posts with joined categories, tags, likes, and view counts.
    Private/draft posts are only visible to authenticated users.
    """
    blog_service = BlogService(session)
    return await blog_service.list_posts(
        skip=skip,
        limit=limit,
        category=category,
        tag=tag,
        search=search,
        status=status,
        author_id=author_id,
        current_user=current_user
    )


@router.get("/{slug}", response_model=PostRead)
async def get_post(
    slug: str = PathParam(..., description="Post slug"),
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get single post details by slug with categories, tags, likes, and view count.
    
    Automatically increments view count when post is accessed.
    Private/draft posts require authentication.
    """
    blog_service = BlogService(session)
    post = await blog_service.get_post_by_slug(slug, current_user)
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Increment view count for found posts
    await blog_service.increment_view_count(post.id)
    
    return post


@router.post("", response_model=PostRead, status_code=201)
async def create_post(
    post_data: PostCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_auth)
):
    """
    Create a new post.
    
    Supports all post types: text, quote, link, photo, audio, video.
    Requires authentication.
    """
    blog_service = BlogService(session)
    return await blog_service.create_post(post_data, current_user)


@router.put("/{post_id}", response_model=PostRead)
async def update_post(
    post_data: PostUpdate,
    post_id: uuid.UUID = PathParam(..., description="Post ID"),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_auth)
):
    """
    Update an existing post.
    
    Only the author or users with appropriate permissions can update posts.
    """
    blog_service = BlogService(session)
    updated_post = await blog_service.update_post(post_id, post_data, current_user)
    
    if not updated_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return updated_post


@router.delete("/{post_id}", status_code=204)
async def delete_post(
    post_id: uuid.UUID = PathParam(..., description="Post ID"),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_auth)
):
    """
    Delete a post.
    
    Only the author or users with appropriate permissions can delete posts.
    """
    blog_service = BlogService(session)
    success = await blog_service.delete_post(post_id, current_user)
    
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")


@router.post("/{post_id}/like", status_code=201)
async def like_post(
    post_id: uuid.UUID = PathParam(..., description="Post ID"),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_auth)
):
    """
    Like a post.
    
    Creates a like entry if not already liked by the user.
    """
    blog_service = BlogService(session)
    success = await blog_service.like_post(post_id, current_user)
    
    if not success:
        raise HTTPException(status_code=404, detail="Post not found or already liked")
    
    return {"message": "Post liked successfully"}


@router.delete("/{post_id}/like", status_code=204)
async def unlike_post(
    post_id: uuid.UUID = PathParam(..., description="Post ID"),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_auth)
):
    """
    Unlike a post.
    
    Removes the like entry if it exists.
    """
    blog_service = BlogService(session)
    success = await blog_service.unlike_post(post_id, current_user)
    
    if not success:
        raise HTTPException(status_code=404, detail="Post not found or not liked")


@router.post("/{post_id}/view")
async def mark_post_viewed(
    post_id: uuid.UUID = PathParam(..., description="Post ID"),
    session: Session = Depends(get_session)
):
    """
    Mark a post as viewed. Increments view_count.
    
    No authentication required - tracks all views.
    """
    blog_service = BlogService(session)
    success = await blog_service.increment_view_count(post_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {"message": "View recorded"}
