from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from typing import List
import uuid

from backend.config.database import get_session
from backend.models.taxonomy import Category, CategoryCreate, CategoryRead, CategoryUpdate
from backend.services.category_service import CategoryService
from backend.middleware import require_auth, get_current_user
from backend.utils import NotFoundError


router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("/", response_model=CategoryRead)
async def create_category(
    category_data: CategoryCreate,
    session: Session = Depends(get_session),
    current_user = Depends(require_auth)
):
    """Create a new category."""
    category_service = CategoryService(session)
    category = category_service.create_category(category_data)
    return category


@router.get("/", response_model=List[CategoryRead])
async def list_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    session: Session = Depends(get_session)
):
    """List all categories with pagination."""
    category_service = CategoryService(session)
    categories = category_service.list_categories(skip=skip, limit=limit)
    return categories


@router.get("/{category_id}", response_model=CategoryRead)
async def get_category(
    category_id: int,
    session: Session = Depends(get_session)
):
    """Get category by ID."""
    category_service = CategoryService(session)
    category = category_service.get_category_by_id(category_id)
    
    if not category:
        raise NotFoundError("Category not found")
    
    return category


@router.put("/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    session: Session = Depends(get_session),
    current_user = Depends(require_auth)
):
    """Update category (authenticated users only)."""
    category_service = CategoryService(session)
    category = category_service.update_category(category_id, category_data)
    return category


@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    session: Session = Depends(get_session),
    current_user = Depends(require_auth)
):
    """Delete category (authenticated users only)."""
    category_service = CategoryService(session)
    category_service.delete_category(category_id)
    return {"message": "Category deleted successfully"}
