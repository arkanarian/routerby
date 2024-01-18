from typing import List
from fastapi import APIRouter, Depends

from backend.db.repository.district_repository import DistrictRepository, get_district_repository
from backend.schemas.district import DistrictInDB


router = APIRouter()

@router.get("", response_model=List[DistrictInDB])
async def get_districts(
    district_repo: DistrictRepository = Depends(get_district_repository),
    limit: int = 10,
    offset: int = 0,
) -> List[DistrictInDB]:
    """
    Get all district.
    """
    districts = await district_repo.get_all(limit=limit, offset=offset)
    return districts
