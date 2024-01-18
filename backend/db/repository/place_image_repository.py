from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.dependencies import get_db
from backend.db.models.place_image import PlaceImage
from backend.db.repository.base import BaseRepository
from backend.schemas.place_image import PlaceImageInCreate, PlaceImageInUpdate

class PlaceImageRepository(BaseRepository[PlaceImage, PlaceImageInCreate, PlaceImageInUpdate]):
    """
    Repository to manipulate with place_image
    """
    pass


def get_place_image_repository(session: AsyncSession = Depends(get_db)) -> PlaceImageRepository:
    return PlaceImageRepository(db=session, model=PlaceImage)

