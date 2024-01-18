import datetime
from functools import total_ordering
from typing import Optional
from fastapi import UploadFile

from pydantic import BaseModel, ConfigDict

from backend.schemas.city import CityInDB
from backend.schemas.district import DistrictInDB
from backend.schemas.place_image import PlaceImageOnlyPath
from backend.schemas.place_type import PlaceTypeInDB


class PlaceBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    description: str
    address: str
    latitude: float
    longitude: float

class PlaceInCreate(PlaceBase):
    alias: str
    time_open: datetime.time
    time_close: datetime.time
    city_id: int
    district_id: int
    place_type_id: int

class PlaceInUpdate(BaseModel):
    pass

class PlaceInDB(PlaceBase):
    id: int

# @total_ordering
class PlaceEntity(PlaceBase):
    id: int
    alias: str
    city: CityInDB
    district: DistrictInDB
    place_type: PlaceTypeInDB
    images: list[PlaceImageOnlyPath]
    liked_amount: int
    views_amount: int
    rating: float

    # def __lt__(self, other):
    #     less_than = (self.images.path < other.images.path)
    #     return less_than

class PlaceCreate(PlaceBase):
    city: str
    district: str
    place_type: str
    images: list[str]
    # images: list[UploadFile] # TODO: upload images
    time_open: datetime.time = datetime.time(9, 00)
    time_close: datetime.time = datetime.time(18, 00)

class PlaceAllInDB(PlaceEntity):
    pass

class PlaceAll(PlaceAllInDB):
    # images: Optional[list[bytes]]
    is_self_liked: bool

class PlaceIds(BaseModel):
    ids: list[int]

class PlaceAlias(BaseModel):
    alias: str

