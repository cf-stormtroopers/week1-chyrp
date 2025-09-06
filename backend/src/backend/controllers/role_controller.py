from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List, Optional

from ..config.database import get_session
from ..services.permission_service import PermissionService
from ..middleware.auth import get_current_user
from ..models.user import User, Role, Permission

router = APIRouter(
    prefix="/roles",
    tags=["Role Management"]
)


@router.get("/", response_model=List[dict])
async def get_all_roles(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get all roles with their permissions.
    Requires admin permissions.
    """
    permission_service = PermissionService(session)
    
    # Check if user has admin permissions
    permissions = permission_service.get_user_permissions(current_user)
    if "update_site_settings" not in permissions:
        raise HTTPException(status_code=403, detail="Admin permissions required")
    
    roles = permission_service.get_all_roles()
    
    # Format roles with permissions
    result = []
    for role in roles:
        role_permissions = permission_service.get_role_permissions(role.id)
        result.append({
            "id": role.id,
            "name": role.name,
            "description": role.description,
            "permissions": [p.name for p in role_permissions]
        })
    
    return result


@router.post("/", response_model=dict)
async def create_role(
    role_data: dict,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new role with permissions.
    Expects: {"name": "role_name", "description": "desc", "permissions": ["perm1", "perm2"]}
    Requires admin permissions.
    """
    permission_service = PermissionService(session)
    
    # Check if user has admin permissions
    permissions = permission_service.get_user_permissions(current_user)
    if "update_site_settings" not in permissions:
        raise HTTPException(status_code=403, detail="Admin permissions required")
    
    # Validate required fields
    if "name" not in role_data:
        raise HTTPException(status_code=400, detail="Role name is required")
    
    # Create role
    role = permission_service.create_role(
        name=role_data["name"],
        description=role_data.get("description", ""),
        permissions=role_data.get("permissions", [])
    )
    
    if not role:
        raise HTTPException(status_code=400, detail="Role already exists or invalid permissions")
    
    # Return created role with permissions
    role_permissions = permission_service.get_role_permissions(role.id)
    return {
        "id": role.id,
        "name": role.name,
        "description": role.description,
        "permissions": [p.name for p in role_permissions]
    }


@router.put("/{role_id}", response_model=dict)
async def update_role(
    role_id: int,
    role_data: dict,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Update a role's permissions.
    Expects: {"permissions": ["perm1", "perm2"]}
    Requires admin permissions.
    """
    permission_service = PermissionService(session)
    
    # Check if user has admin permissions
    permissions = permission_service.get_user_permissions(current_user)
    if "update_site_settings" not in permissions:
        raise HTTPException(status_code=403, detail="Admin permissions required")
    
    # Check if role exists
    role = permission_service.get_role_by_id(role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # Update role permissions
    success = permission_service.update_role_permissions(
        role_id=role_id,
        permissions=role_data.get("permissions", [])
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="Role not found or invalid permissions")
    
    # Return updated role
    role_permissions = permission_service.get_role_permissions(role_id)
    
    return {
        "id": role.id,
        "name": role.name,
        "description": role.description,
        "permissions": [p.name for p in role_permissions]
    }


@router.delete("/{role_id}")
async def delete_role(
    role_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a role.
    Cannot delete the 'public' role.
    Requires admin permissions.
    """
    permission_service = PermissionService(session)
    
    # Check if user has admin permissions
    permissions = permission_service.get_user_permissions(current_user)
    if "update_site_settings" not in permissions:
        raise HTTPException(status_code=403, detail="Admin permissions required")
    
    # Check if it's the public role
    role = permission_service.get_role_by_id(role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    if role.name == "public":
        raise HTTPException(status_code=400, detail="Cannot delete the public role")
    
    # Delete role
    success = permission_service.delete_role(role_id)
    if not success:
        raise HTTPException(status_code=404, detail="Role not found")
    
    return {"message": "Role deleted successfully"}


@router.get("/permissions", response_model=List[dict])
async def get_all_permissions(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get all available permissions.
    Requires admin permissions.
    """
    permission_service = PermissionService(session)
    
    # Check if user has admin permissions
    permissions = permission_service.get_user_permissions(current_user)
    if "update_site_settings" not in permissions:
        raise HTTPException(status_code=403, detail="Admin permissions required")
    
    permissions_list = permission_service.get_all_permissions()
    
    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description
        }
        for p in permissions_list
    ]
