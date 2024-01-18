from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.dependencies import get_db
from backend.db.models.liked_place import LikedPlace
from backend.db.repository.base import BaseRepository
from backend.schemas.liked_place import LikedPlaceInCreate, LikedPlaceInUpdate

class LikedPlaceRepository(BaseRepository[LikedPlace, LikedPlaceInCreate, LikedPlaceInUpdate]):
    """
    Repository to manipulate with LikedPlace
    """
    pass


def get_liked_place_repository(session: AsyncSession = Depends(get_db)) -> LikedPlaceRepository:
    return LikedPlaceRepository(db=session, model=LikedPlace)