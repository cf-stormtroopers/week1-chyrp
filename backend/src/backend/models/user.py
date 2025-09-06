from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid

from .base import BaseModel


class User(BaseModel, table=True):
    """User model."""

    __tablename__ = "users"

    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str = Field(max_length=50, unique=True, index=True)
    email: str = Field(max_length=255, unique=True, index=True)
    password_hash: str = Field(max_length=255)
    display_name: Optional[str] = Field(default=None, max_length=100)
    bio: Optional[str] = Field(default=None)
    avatar_url: Optional[str] = Field(default=None, max_length=255)
    role_id: int = Field(foreign_key="roles.id", default=1)  # Default to 'public' role
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(SQLModel):
    """Model for user creation."""

    username: str = Field(max_length=50)
    email: str = Field(max_length=255)
    password: str = Field()
    display_name: Optional[str] = Field(default=None, max_length=100)
    bio: Optional[str] = Field(default=None)
    role_name: Optional[str] = Field(
        default=None, max_length=50
    )  # Allow specifying role by name during creation


class UserRead(SQLModel):
    """Model for user response (without sensitive data)."""

    id: uuid.UUID
    username: str
    email: str
    display_name: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    role_id: int
    role_name: Optional[str] = None  # Will be populated by service layer
    created_at: datetime
    updated_at: datetime


class UserUpdate(SQLModel):
    """Model for user updates."""

    display_name: Optional[str] = Field(default=None, max_length=100)
    bio: Optional[str] = Field(default=None)
    avatar_url: Optional[str] = Field(default=None, max_length=255)
    password: Optional[str] = Field(default=None)
    password_hash: Optional[str] = None  # Internal use only
    role_name: Optional[str] = Field(
        default=None, max_length=50
    )  # Allow updating role by name


class UserLogin(SQLModel):
    """Model for user login."""

    username: str
    password: str


# Role and Permission models
class Role(SQLModel, table=True):
    """Role model."""

    __tablename__ = "roles"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=50, unique=True)
    description: Optional[str] = Field(default=None)


class Permission(SQLModel, table=True):
    """Permission model."""

    __tablename__ = "permissions"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100, unique=True)
    description: Optional[str] = Field(default=None)


# Deprecated: UserRole table removed - users now have direct role_id foreign key
# class UserRole(SQLModel, table=True):
#     """User-Role association model."""
#
#     __tablename__ = "user_roles"
#
#     user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True)
#     role_id: int = Field(foreign_key="roles.id", primary_key=True)


class RolePermission(SQLModel, table=True):
    """Role-Permission association model."""

    __tablename__ = "role_permissions"

    role_id: int = Field(foreign_key="roles.id", primary_key=True)
    permission_id: int = Field(foreign_key="permissions.id", primary_key=True)
