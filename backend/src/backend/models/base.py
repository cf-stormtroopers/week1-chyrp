from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid


class BaseModel(SQLModel):
    """Base model for common functionality."""
    pass
