from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.dependencies import get_db
from backend.db.models.city import City
from backend.db.repository.base import BaseRepository
from backend.schemas.city import CityInCreate, CityInUpdate

class CityRepository(BaseRepository[City, CityInCreate, CityInUpdate]):
    """
    Repository to manipulate with city
    """
    pass


def get_city_repository(session: AsyncSession = Depends(get_db)) -> CityRepository:
    return CityRepository(db=session, model=City)
