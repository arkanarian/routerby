from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.dependencies import get_db
from backend.db.models.place_type import PlaceType
from backend.db.models.place import Place
from backend.db.repository.base import BaseRepository
from backend.schemas.place_type import PlaceTypeInCreate, PlaceTypeInUpdate

class PlaceTypeRepository(BaseRepository[PlaceType, PlaceTypeInCreate, PlaceTypeInUpdate]):
    """
    Repository to manipulate with PlaceType
    """
    pass


def get_place_type_repository(session: AsyncSession = Depends(get_db)) -> PlaceTypeRepository:
    return PlaceTypeRepository(db=session, model=PlaceType)
