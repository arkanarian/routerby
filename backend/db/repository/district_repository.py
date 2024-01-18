from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.dependencies import get_db
from backend.db.models.district import District
from backend.db.repository.base import BaseRepository
from backend.schemas.district import DistrictInCreate, DistrictInUpdate

class DistrictRepository(BaseRepository[District, DistrictInCreate, DistrictInUpdate]):
    """
    Repository to manipulate with District
    """
    pass


def get_district_repository(session: AsyncSession = Depends(get_db)) -> DistrictRepository:
    return DistrictRepository(db=session, model=District)