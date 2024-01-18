from typing import List
from fastapi import APIRouter, Depends

from backend.db.repository.city_repository import CityRepository, get_city_repository
from backend.schemas.city import CityInDB


router = APIRouter()

@router.get("", response_model=List[CityInDB])
async def get_cities(
    city_repo: CityRepository = Depends(get_city_repository),
    limit: int = 500,
    offset: int = 0,
) -> List[CityInDB]:
    """
    Get all cities.
    """
    cities = await city_repo.get_all(limit=limit, offset=offset)
    return cities
