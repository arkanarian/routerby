import uuid

from fastapi_users import schemas
from pydantic import BaseModel


class UserRead(schemas.BaseUser[uuid.UUID]):
    """Represents a read command for a user."""
    username: str


class UserCreate(schemas.BaseUserCreate):
    """Represents a create command for a user."""
    username: str


class UserUpdate(schemas.BaseUserUpdate):
    """Represents an update command for a user."""


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"
