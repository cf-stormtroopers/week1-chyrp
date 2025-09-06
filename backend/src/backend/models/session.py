from sqlmodel import SQLModel, Field
from datetime import datetime, timedelta
from typing import Optional
import uuid


class UserSession(SQLModel, table=True):
    """User session model."""
    
    __tablename__ = "user_sessions"
    
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    session_token: str = Field(unique=True, index=True)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    @classmethod
    def create_session_token(cls) -> str:
        """Generate a secure session token."""
        return str(uuid.uuid4())
    
    @classmethod
    def get_expiry_time(cls) -> datetime:
        """Get session expiry time."""
        return datetime.utcnow() + timedelta(hours=24)  # Default 24 hours


class SessionCreate(SQLModel):
    """Model for session creation."""
    user_id: uuid.UUID
    
    
class SessionRead(SQLModel):
    """Model for session response."""
    id: uuid.UUID
    user_id: uuid.UUID
    session_token: str
    expires_at: datetime
    created_at: datetime
