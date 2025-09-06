from sqlmodel import SQLModel
from typing import Optional, List, Dict, Any

from ..models.user import UserRead


class SiteInfoResponse(SQLModel):
    """Model for site information response."""
    user: Optional[UserRead] = None
    blog_title: str
    blog_description: str
    extensions: List[str]
    theme: Optional[str]
    settings: Dict[str, Any]
    features: List[str]
    permissions: List[str]


class SettingsUpdateRequest(SQLModel):
    """Model for settings update request."""
    blog_title: Optional[str] = None
    show_search: Optional[bool] = None
    show_markdown: Optional[bool] = None
    show_registration: Optional[bool] = None


class SettingsUpdateResponse(SQLModel):
    """Model for settings update response."""
    updated_settings: Dict[str, Any]


class ExtensionInfo(SQLModel):
    """Model for extension information."""
    id: int
    name: str
    slug: str
    version: Optional[str]
    is_active: bool
    config: Optional[Dict[str, Any]]


class ExtensionsResponse(SQLModel):
    """Model for extensions list response."""
    extensions: List[ExtensionInfo]


class ExtensionStatusRequest(SQLModel):
    """Model for extension status update request."""
    active: bool


class ExtensionStatusResponse(SQLModel):
    """Model for extension status update response."""
    success: bool
    message: str
    extension_id: int
    is_active: bool
