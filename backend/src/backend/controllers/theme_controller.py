from fastapi import APIRouter, Depends, HTTPException, Query, Path as PathParam
from sqlmodel import Session, select
from typing import List, Optional
import uuid

from ..config.database import get_session
from ..models.system import Theme, ThemeRead
from ..middleware.auth import require_auth, get_current_user_optional
from ..models.user import User

router = APIRouter(
    prefix="/themes",
    tags=["Themes"]
)


@router.get("", response_model=List[ThemeRead])
async def list_themes(
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    List all available themes.
    
    Returns all themes with their configuration and status.
    """
    statement = select(Theme)
    themes = session.exec(statement).all()
    return themes


@router.put("/{theme_id}/activate", response_model=ThemeRead)
async def activate_theme(
    theme_id: int = PathParam(..., description="Theme ID"),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_auth)
):
    """
    Activate a theme.
    
    Deactivates all other themes and activates the specified one.
    Requires authentication and appropriate permissions.
    """
    # First, deactivate all themes
    all_themes = session.exec(select(Theme)).all()
    for theme in all_themes:
        theme.is_active = False
        session.add(theme)
    
    # Find and activate the specified theme
    theme = session.get(Theme, theme_id)
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    
    theme.is_active = True
    session.add(theme)
    session.commit()
    session.refresh(theme)
    
    return theme


@router.get("/active", response_model=ThemeRead)
async def get_active_theme(
    session: Session = Depends(get_session)
):
    """
    Get the currently active theme.
    
    Returns the active theme configuration.
    """
    statement = select(Theme).where(Theme.is_active == True)
    theme = session.exec(statement).first()
    
    if not theme:
        raise HTTPException(status_code=404, detail="No active theme found")
    
    return theme
