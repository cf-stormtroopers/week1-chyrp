from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum
import uuid
from ipaddress import IPv4Address, IPv6Address
from typing import Union

from .base import BaseModel


class CommentStatus(str, Enum):
    """Comment status enumeration."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SPAM = "spam"


class Comment(BaseModel, table=True):
    """Comment model."""
    
    __tablename__ = "comments"
    
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    post_id: uuid.UUID = Field(foreign_key="posts.id", index=True)
    author_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id")
    
    # Guest comment fields (when author_id is None)
    author_name: Optional[str] = Field(default=None, max_length=100)
    author_email: Optional[str] = Field(default=None, max_length=255)
    author_url: Optional[str] = Field(default=None, max_length=255)
    
    content: str
    parent_comment_id: Optional[uuid.UUID] = Field(default=None, foreign_key="comments.id", index=True)
    status: CommentStatus = Field(default=CommentStatus.PENDING, index=True)
    ip_address: Optional[str] = Field(default=None, max_length=45)  # Supports both IPv4 and IPv6
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ================================
# DTOs for Comments - Future Claude: Add your request/response models here
# ================================

class CommentCreate(SQLModel):
    """Model for comment creation."""
    post_id: uuid.UUID
    content: str
    parent_comment_id: Optional[uuid.UUID] = Field(default=None)
    
    # For guest comments
    author_name: Optional[str] = Field(default=None, max_length=100)
    author_email: Optional[str] = Field(default=None, max_length=255)
    author_url: Optional[str] = Field(default=None, max_length=255)


class CommentRead(SQLModel):
    """Model for comment response."""
    id: uuid.UUID
    post_id: uuid.UUID
    author_id: Optional[uuid.UUID]
    author_name: Optional[str]
    author_email: Optional[str]
    author_url: Optional[str]
    content: str
    parent_comment_id: Optional[uuid.UUID]
    status: CommentStatus
    created_at: datetime
    updated_at: datetime


class CommentUpdate(SQLModel):
    """Model for comment updates."""
    content: Optional[str] = Field(default=None)
    status: Optional[CommentStatus] = Field(default=None)


class CommentModerationUpdate(SQLModel):
    """Model for comment moderation (admin only)."""
    status: CommentStatus
