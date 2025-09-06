from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List, Optional

from ..config.database import get_session
from ..models.site import SiteInfoResponse, ExtensionsResponse, ExtensionInfo, SettingsUpdateRequest, SettingsUpdateResponse, ExtensionStatusRequest, ExtensionStatusResponse
from ..models.system import ExtensionRead
from ..services.site_service import SiteService
from ..middleware.auth import get_current_user_optional, get_current_user
from ..models.user import User

router = APIRouter(
    prefix="/site",
    tags=["Site Information"]
)


@router.get("/info", response_model=SiteInfoResponse)
async def get_site_info(
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get general site information including:
    - User information (if authenticated) 
    - Blog title and description
    - List of active extensions
    - Current theme
    - Public settings
    - Enabled features
    
    This endpoint provides all the essential information needed
    to configure the frontend application.
    """
    site_service = SiteService(session)
    site_info = await site_service.get_site_info(current_user)
    
    return SiteInfoResponse(**site_info)


@router.get("/extensions", response_model=ExtensionsResponse)
async def get_extensions(
    active_only: bool = False,
    session: Session = Depends(get_session)
):
    """
    Get all extensions or only active ones.
    
    This endpoint returns detailed information about extensions
    including their configuration and status.
    """
    site_service = SiteService(session)
    
    if active_only:
        extensions = await site_service.get_active_extensions()
    else:
        extensions = await site_service.get_all_extensions()
    
    extension_infos = [
        ExtensionInfo(
            id=ext.id,
            name=ext.name,
            slug=ext.slug,
            version=ext.version,
            is_active=ext.is_active,
            config=ext.config
        )
        for ext in extensions
    ]
    
    return ExtensionsResponse(extensions=extension_infos)


@router.get("/extensions/active", response_model=List[str])
async def get_active_extension_names(
    session: Session = Depends(get_session)
):
    """
    Get list of active extension names.
    
    Returns a simple list of extension names that are currently active.
    Useful for quick feature detection in the frontend.
    """
    site_service = SiteService(session)
    return await site_service._get_active_extensions()


@router.get("/features", response_model=List[str])
async def get_enabled_features(
    session: Session = Depends(get_session)
):
    """
    Get list of enabled features.
    
    Returns a list of feature flags that indicate what functionality
    is available on this site (comments, registration, uploads, etc.).
    """
    site_service = SiteService(session)
    return await site_service._get_enabled_features()


@router.get("/theme")
async def get_active_theme(
    session: Session = Depends(get_session)
):
    """
    Get the currently active theme information.
    
    Returns the name and details of the active theme.
    """
    site_service = SiteService(session)
    theme_name = await site_service._get_active_theme_name()
    
    if not theme_name:
        raise HTTPException(status_code=404, detail="No active theme found")
    
    return {
        "name": theme_name,
        "is_active": True
    }


@router.put("/extension/{extension_slug}", response_model=ExtensionStatusResponse)
async def update_extension_status(
    extension_slug: str,
    request: ExtensionStatusRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Update the active status of an extension.
    
    Allows enabling or disabling extensions. Requires admin permissions.
    """
    site_service = SiteService(session)
    
    # Check if user has admin permissions (same check as /settings)
    permissions = site_service.permission_service.get_user_permissions(current_user)

    if "update_site_settings" not in permissions:
        raise HTTPException(status_code=403, detail="Admin permissions required")
    
    try:
        updated_extension = await site_service.update_extension_status(
            extension_slug=extension_slug,
            is_active=request.active
        )
        
        return ExtensionStatusResponse(
            success=True,
            message=f"Extension {'activated' if request.active else 'deactivated'} successfully",
            extension_id=updated_extension.id,
            is_active=updated_extension.is_active
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/settings", response_model=SettingsUpdateResponse)
async def update_settings(
    request: SettingsUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Update site settings.
    
    Allows updating of blog title and feature flags like search, markdown, and registration.
    Requires authentication.
    """
    site_service = SiteService(session)
    
    # Check if user has admin permissions
    permissions = site_service.permission_service.get_user_permissions(current_user)

    print(permissions)

    if "update_site_settings" not in permissions:
        raise HTTPException(status_code=403, detail="Admin permissions required")
    
    updated_settings = await site_service.update_settings(
        blog_title=request.blog_title,
        show_search=request.show_search,
        show_markdown=request.show_markdown,
        show_registration=request.show_registration
    )
    
    return SettingsUpdateResponse(updated_settings=updated_settings)