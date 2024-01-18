from pydantic import BaseModel, ConfigDict


class CityBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class CityInCreate(CityBase):
    pass

class CityInUpdate(CityBase):
    pass

class CityInDB(CityBase):
    alias: str
    name: str