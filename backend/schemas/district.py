from pydantic import BaseModel, ConfigDict


class DistrictBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class DistrictInCreate(DistrictBase):
    pass

class DistrictInUpdate(DistrictBase):
    pass

class DistrictInDB(DistrictBase):
    alias: str
    name: str