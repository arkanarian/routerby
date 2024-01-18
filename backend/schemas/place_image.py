from functools import total_ordering
from pydantic import BaseModel, ConfigDict


class PlaceImageBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class PlaceImageInCreate(PlaceImageBase):
    path: str
    place_id: int

class PlaceImageInUpdate(PlaceImageBase):
    pass

class PlaceImageInDB(PlaceImageBase):
    path: str
    place_id: int

@total_ordering
class PlaceImageOnlyPath(PlaceImageBase):
    path: str

    def __lt__(self, other):
        less_than = (self.path < other.path)
        return less_than