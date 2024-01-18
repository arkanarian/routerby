from pydantic import BaseModel, ConfigDict


class PlaceTypeBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class PlaceTypeInCreate(PlaceTypeBase):
    pass

class PlaceTypeInUpdate(PlaceTypeBase):
    pass

class PlaceTypeInDB(PlaceTypeBase):
    alias: str
    name: str