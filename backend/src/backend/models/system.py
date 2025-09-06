from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON
from typing import Optional, Dict, Any


class SettingType(str):
    """Setting type enumeration."""
    STRING = "string"
    INTEGER = "integer"
    BOOLEAN = "boolean"
    JSON = "json"


class Setting(SQLModel, table=True):
    """System setting model."""
    
    __tablename__ = "settings"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(max_length=100, unique=True, index=True)
    value: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    type: Optional[str] = Field(default=SettingType.STRING, max_length=50)


class Theme(SQLModel, table=True):
    """Theme model."""
    
    __tablename__ = "themes"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100, unique=True)
    slug: str = Field(max_length=255, unique=True, index=True)
    version: Optional[str] = Field(default=None, max_length=20)
    author: Optional[str] = Field(default=None, max_length=100)
    is_active: bool = Field(default=False)


class Extension(SQLModel, table=True):
    """Extension model."""
    
    __tablename__ = "extensions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100, unique=True)
    slug: str = Field(max_length=255, unique=True, index=True)
    version: Optional[str] = Field(default=None, max_length=20)
    is_active: bool = Field(default=False)
    config: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))


# ================================
# DTOs for System Configuration - Future Claude: Add your request/response models here
# ================================

class SettingCreate(SQLModel):
    """Model for setting creation."""
    key: str = Field(max_length=100)
    value: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    type: str = Field(default=SettingType.STRING, max_length=50)


class SettingRead(SQLModel):
    """Model for setting response."""
    id: int
    key: str
    value: Optional[str]
    description: Optional[str]
    type: Optional[str]


class SettingUpdate(SQLModel):
    """Model for setting updates."""
    value: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    type: Optional[str] = Field(default=None, max_length=50)


class ThemeCreate(SQLModel):
    """Model for theme creation."""
    name: str = Field(max_length=100)
    slug: str = Field(max_length=255)
    version: Optional[str] = Field(default=None, max_length=20)
    author: Optional[str] = Field(default=None, max_length=100)
    is_active: bool = Field(default=False)


class ThemeRead(SQLModel):
    """Model for theme response."""
    id: int
    name: str
    slug: str
    version: Optional[str]
    author: Optional[str]
    is_active: bool


class ThemeUpdate(SQLModel):
    """Model for theme updates."""
    name: Optional[str] = Field(default=None, max_length=100)
    version: Optional[str] = Field(default=None, max_length=20)
    author: Optional[str] = Field(default=None, max_length=100)
    is_active: Optional[bool] = Field(default=None)


class ExtensionCreate(SQLModel):
    """Model for extension creation."""
    name: str = Field(max_length=100)
    slug: str = Field(max_length=255)
    version: Optional[str] = Field(default=None, max_length=20)
    is_active: bool = Field(default=False)
    config: Optional[Dict[str, Any]] = Field(default=None)


class ExtensionRead(SQLModel):
    """Model for extension response."""
    id: int
    name: str
    slug: str
    version: Optional[str]
    is_active: bool
    config: Optional[Dict[str, Any]]


class ExtensionUpdate(SQLModel):
    """Model for extension updates."""
    name: Optional[str] = Field(default=None, max_length=100)
    version: Optional[str] = Field(default=None, max_length=20)
    is_active: Optional[bool] = Field(default=None)
    config: Optional[Dict[str, Any]] = Field(default=None)
