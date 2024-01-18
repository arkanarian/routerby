from typing import Optional

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.dependencies import get_db
from backend.db.models.user import User
from backend.db.repository.base import BaseRepository
from backend.schemas.user import UserCreate, UserUpdate


class UsersRepository(BaseRepository[User, UserCreate, UserUpdate]):
    """
    Repository to manipulate with the task.
    """

    def get_by_username(self, username: str) -> Optional[User]:
        """
        Get user by `username` field.
        """
        return self.db.query(User).filter(User.username == username).first()

    @staticmethod
    def is_active(user: User) -> bool:
        """
        Check if user is active.
        """
        return not user.disabled
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """
        Get user by `email` field.
        """
        stmt = select(self.model).where(self.model.email == email)
        result = await self.db.execute(stmt)
        return result.scalars().first()


def get_users_repository(session: AsyncSession = Depends(get_db)) -> UsersRepository:
    return UsersRepository(db=session, model=User)
