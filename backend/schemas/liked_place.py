from pydantic import BaseModel, ConfigDict


class LikedPlaceBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class LikedPlaceInCreate(LikedPlaceBase):
    pass

class LikedPlaceInUpdate(LikedPlaceBase):
    pass

class LikedPlaceInDB(LikedPlaceBase):
    user_id: int
    place_id: int
