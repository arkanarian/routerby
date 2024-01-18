from typing import List
from fastapi import APIRouter, Depends

from backend.db.repository.place_type_repository import PlaceTypeRepository, get_place_type_repository
from backend.schemas.place_type import PlaceTypeInDB


router = APIRouter()

@router.get("", response_model=List[PlaceTypeInDB])
async def get_place_types(
    place_type_repo: PlaceTypeRepository = Depends(get_place_type_repository),
    limit: int = 100,
    offset: int = 0,
) -> List[PlaceTypeInDB]:
    """
    Get all place types.
    """
    place_types = await place_type_repo.get_all(limit=limit, offset=offset)
    return place_types