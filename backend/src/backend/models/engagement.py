from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum
import uuid

from .base import BaseModel


class Like(BaseModel, table=True):
    """Like model."""
    
    __tablename__ = "likes"
    
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    post_id: uuid.UUID = Field(foreign_key="posts.id", index=True)
    user_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id", index=True)
    ip_address: Optional[str] = Field(default=None, max_length=45)  # For anonymous likes
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Note: Unique constraints are handled at the database level
    # unique_like_per_user_post and unique_like_per_ip_post indexes


class WebmentionType(str, Enum):
    """Webmention type enumeration."""
    MENTION = "mention"
    REPLY = "reply"
    REPOST = "repost"
    LIKE = "like"
    BOOKMARK = "bookmark"


class WebmentionStatus(str, Enum):
    """Webmention status enumeration."""
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class Webmention(BaseModel, table=True):
    """Webmention model."""
    
    __tablename__ = "webmentions"
    
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    post_id: uuid.UUID = Field(foreign_key="posts.id", index=True)
    source_url: str = Field(max_length=255, index=True)
    target_url: str = Field(max_length=255)
    mention_type: Optional[WebmentionType] = Field(default=None)
    content: Optional[str] = Field(default=None)
    author_name: Optional[str] = Field(default=None, max_length=255)
    author_url: Optional[str] = Field(default=None, max_length=255)
    author_photo: Optional[str] = Field(default=None, max_length=255)
    status: WebmentionStatus = Field(default=WebmentionStatus.PENDING)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Note: unique constraint on (source_url, target_url) handled at DB level


# ================================
# DTOs for Likes and Webmentions - Future Claude: Add your request/response models here
# ================================

class LikeCreate(SQLModel):
    """Model for like creation."""
    post_id: uuid.UUID


class LikeRead(SQLModel):
    """Model for like response."""
    id: uuid.UUID
    post_id: uuid.UUID
    user_id: Optional[uuid.UUID]
    created_at: datetime


class WebmentionCreate(SQLModel):
    """Model for webmention creation."""
    post_id: uuid.UUID
    source_url: str = Field(max_length=255)
    target_url: str = Field(max_length=255)
    mention_type: Optional[WebmentionType] = Field(default=None)
    content: Optional[str] = Field(default=None)
    author_name: Optional[str] = Field(default=None, max_length=255)
    author_url: Optional[str] = Field(default=None, max_length=255)
    author_photo: Optional[str] = Field(default=None, max_length=255)


class WebmentionRead(SQLModel):
    """Model for webmention response."""
    id: uuid.UUID
    post_id: uuid.UUID
    source_url: str
    target_url: str
    mention_type: Optional[WebmentionType]
    content: Optional[str]
    author_name: Optional[str]
    author_url: Optional[str]
    author_photo: Optional[str]
    status: WebmentionStatus
    created_at: datetime


class WebmentionUpdate(SQLModel):
    """Model for webmention updates."""
    status: Optional[WebmentionStatus] = Field(default=None)
    content: Optional[str] = Field(default=None)
    author_name: Optional[str] = Field(default=None, max_length=255)
    author_url: Optional[str] = Field(default=None, max_length=255)
    author_photo: Optional[str] = Field(default=None, max_length=255)
