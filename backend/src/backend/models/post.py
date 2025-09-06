from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid
from enum import Enum

from .base import BaseModel


class PostStatus(str, Enum):
    """Post status enumeration."""

    DRAFT = "draft"
    PUBLISHED = "published"
    SCHEDULED = "scheduled"
    PRIVATE = "private"


class Post(BaseModel, table=True):
    """Post model."""

    __tablename__ = "posts"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    author_id: uuid.UUID = Field(foreign_key="users.id")
    feather_type: str = Field(
        max_length=50
    )  # Type of post (text, photo, quote, link, etc.)
    slug: str = Field(max_length=255, unique=True, index=True)
    title: Optional[str] = Field(default=None, max_length=255)
    status: PostStatus = Field(default=PostStatus.DRAFT)
    published_at: Optional[datetime] = Field(default=None)
    is_private: bool = Field(default=False)
    view_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class PostData(SQLModel, table=True):
    """Post data model - stores the actual content of posts."""

    __tablename__ = "post_data"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    post_id: uuid.UUID = Field(foreign_key="posts.id", unique=True)

    # Text content
    content: Optional[str] = Field(default=None)
    markdown_content: Optional[str] = Field(default=None)
    raw_markup: Optional[str] = Field(default=None)

    # Media content
    media_url: Optional[str] = Field(default=None, max_length=255)
    media_thumbnail_url: Optional[str] = Field(default=None, max_length=255)
    media_type: Optional[str] = Field(default=None, max_length=50)

    # Quote content
    quote_source: Optional[str] = Field(default=None, max_length=255)
    quote_url: Optional[str] = Field(default=None, max_length=255)

    # Link content
    link_url: Optional[str] = Field(default=None, max_length=255)

    # Embed content
    embed_code: Optional[str] = Field(default=None)

    # Attribution
    attribution: Optional[str] = Field(default=None, max_length=255)
    copyright: Optional[str] = Field(default=None, max_length=255)


class PostFile(BaseModel, table=True):
    """Post file model - for file attachments."""

    __tablename__ = "post_files"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    post_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="posts.id", index=True
    )
    file_url: str = Field(max_length=255)  # URL to access the file (matches SQL)
    filename: str = Field(max_length=255)  # Original filename
    file_type: Optional[str] = Field(
        default=None, max_length=100
    )  # File type (matches SQL)
    file_size: Optional[int] = Field(default=None)  # File size in bytes
    description: Optional[str] = Field(default=None)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)  # Matches SQL


# ================================
# DTOs for Posts - Future Claude: Add your request/response models here
# ================================


class PostCreate(SQLModel):
    """Model for post creation."""

    feather_type: str = Field(max_length=50)
    slug: str = Field(max_length=255)
    title: Optional[str] = Field(default=None, max_length=255)
    status: PostStatus = Field(default=PostStatus.DRAFT)
    is_private: bool = Field(default=False)

    # Post data
    content: Optional[str] = Field(default=None)
    markdown_content: Optional[str] = Field(default=None)
    media_url: Optional[str] = Field(default=None, max_length=255)
    link_url: Optional[str] = Field(default=None, max_length=300)
    media_type: Optional[str] = Field(default=None, max_length=50)
    quote_source: Optional[str] = Field(default=None, max_length=255)


class PostRead(SQLModel):
    """Model for post response."""

    id: uuid.UUID
    author_id: uuid.UUID
    author_name: str
    feather_type: str
    slug: str
    title: Optional[str]
    status: PostStatus
    published_at: Optional[datetime]
    is_private: bool
    view_count: int
    created_at: datetime
    updated_at: datetime

    # Additional fields for rich responses
    categories: List[dict] = Field(default_factory=list)
    tags: List[dict] = Field(default_factory=list)
    likes_count: int = Field(default=0)

    # PostData join
    content: Optional[str] = Field(default=None)
    excerpt: Optional[str] = Field(default=None)
    media_url: Optional[str] = Field(default=None)
    media_type: Optional[str] = Field(default=None)
    quote_source: Optional[str] = Field(default=None)
    link_url: Optional[str] = Field(default=None)


class PostUpdate(SQLModel):
    """Model for post updates."""

    title: Optional[str] = Field(default=None, max_length=255)
    status: Optional[PostStatus] = Field(default=None)
    is_private: Optional[bool] = Field(default=None)
    content: Optional[str] = Field(default=None)
    markdown_content: Optional[str] = Field(default=None)


class PostSummary(SQLModel):
    """Model for post summary/listing."""

    id: uuid.UUID
    slug: str
    title: Optional[str]
    feather_type: str
    status: PostStatus
    published_at: Optional[datetime]
    view_count: int
    created_at: datetime


class PostFileCreate(SQLModel):
    """Model for file creation."""

    post_id: Optional[uuid.UUID] = Field(default=None)
    filename: str = Field(max_length=255)
    file_path: str = Field(max_length=500)
    mime_type: str = Field(max_length=100)
    file_size: int = Field(default=0)
    description: Optional[str] = Field(default=None)


class PostFileRead(SQLModel):
    """Model for file response."""

    id: uuid.UUID
    post_id: Optional[uuid.UUID]
    filename: Optional[str]
    file_path: Optional[str]
    mime_type: Optional[str]
    file_size: Optional[int]
    description: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
