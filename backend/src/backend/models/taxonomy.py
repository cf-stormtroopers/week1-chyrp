from sqlmodel import SQLModel, Field
from typing import Optional
import uuid


class Category(SQLModel, table=True):
    """Category model."""
    
    __tablename__ = "categories"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100, unique=True)
    slug: str = Field(max_length=100, unique=True, index=True)
    description: Optional[str] = Field(default=None)


class Tag(SQLModel, table=True):
    """Tag model."""
    
    __tablename__ = "tags"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100, unique=True)
    slug: str = Field(max_length=100, unique=True, index=True)


class PostCategory(SQLModel, table=True):
    """Post-Category association model."""
    
    __tablename__ = "post_categories"
    
    post_id: uuid.UUID = Field(foreign_key="posts.id", primary_key=True)
    category_id: int = Field(foreign_key="categories.id", primary_key=True)


class PostTag(SQLModel, table=True):
    """Post-Tag association model."""
    
    __tablename__ = "post_tags"
    
    post_id: uuid.UUID = Field(foreign_key="posts.id", primary_key=True)
    tag_id: int = Field(foreign_key="tags.id", primary_key=True)


# ================================
# DTOs for Categories and Tags - Future Claude: Add your request/response models here
# ================================

class CategoryCreate(SQLModel):
    """Model for category creation."""
    name: str = Field(max_length=100)
    slug: str = Field(max_length=100)
    description: Optional[str] = Field(default=None)


class CategoryRead(SQLModel):
    """Model for category response."""
    id: int
    name: str
    slug: str
    description: Optional[str]


class CategoryUpdate(SQLModel):
    """Model for category updates."""
    name: Optional[str] = Field(default=None, max_length=100)
    slug: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(default=None)


class TagCreate(SQLModel):
    """Model for tag creation."""
    name: str = Field(max_length=100)
    slug: str = Field(max_length=100)


class TagRead(SQLModel):
    """Model for tag response."""
    id: int
    name: str
    slug: str


class TagUpdate(SQLModel):
    """Model for tag updates."""
    name: Optional[str] = Field(default=None, max_length=100)
    slug: Optional[str] = Field(default=None, max_length=100)
