from fastapi import Depends
from transliterate import translit
from backend.db.models.user import User
from backend.db.repository.city_repository import CityRepository, get_city_repository
from backend.db.repository.district_repository import DistrictRepository, get_district_repository
from backend.db.repository.liked_places_repo import LikedPlaceRepository, get_liked_place_repository
from backend.db.repository.place_image_repository import PlaceImageRepository, get_place_image_repository

from backend.db.repository.place_repository import PlaceRepository, get_place_repository
from backend.db.repository.place_type_repository import PlaceTypeRepository, get_place_type_repository
from backend.schemas.place import PlaceAll, PlaceAllInDB, PlaceCreate, PlaceInCreate, PlaceInDB
from backend.schemas.place_image import PlaceImageInCreate
from backend.utils import Utils


class PlaceService:
    def __init__(
        self,
        place_repo: PlaceRepository = Depends(get_place_repository),
        city_repo: CityRepository = Depends(get_city_repository),
        district_repo: DistrictRepository = Depends(get_district_repository),
        place_type_repo: PlaceTypeRepository = Depends(get_place_type_repository),
        place_image_repo: PlaceImageRepository = Depends(get_place_image_repository),
        liked_places_repo: LikedPlaceRepository = Depends(get_liked_place_repository),
    ) -> None:
        self.place_repo = place_repo
        self.city_repo = city_repo
        self.district_repo = district_repo
        self.place_type_repo = place_type_repo
        self.place_image_repo = place_image_repo
        self.liked_places_repo = liked_places_repo
    
    async def create_place(self, place_data: PlaceCreate) -> PlaceInDB:
        city = await self.city_repo.get_one(alias=place_data.city)
        district = await self.district_repo.get_one(alias=place_data.district)
        place_type = await self.place_type_repo.get_one(alias=place_data.place_type)

        alias = translit(place_data.name, 'ru', reversed=True).lower().replace(' ', '-')
        place = PlaceInCreate(
            **place_data.model_dump(exclude={'images'}),
            alias=alias,
            city_id=city.id,
            district_id=district.id,
            place_type_id=place_type.id,
        )
        place = await self.place_repo.create(obj_create=place)

        for img in place_data.images:
            image = PlaceImageInCreate(place_id=place.id, path=img)
            await self.place_image_repo.create(obj_create=image)  # TODO: upload images

        return place
    
    async def get_all(self, user: User, limit: int = 10, offset: int = 0) -> list[PlaceAll]:
        places = await self.place_repo.get_all_joined(limit=limit, offset=offset)
        places_res = []
        for place in places:
            place_data = PlaceAllInDB.model_validate(place)
            is_self_liked = bool(await self.liked_places_repo.get_one_or_none(place_id=place.id, user_id=user.id))
            place_data.images.sort()
            places_res.append(PlaceAll(**place_data.model_dump(), is_self_liked=is_self_liked))
            # all_image_paths = [image.path for image in place_data.images]
            # images: dict = Utils.get_images(all_image_paths)
            # TODO: экстрактить изображения
        return places_res

    async def get_images(self, place_id: int) -> bytes:
        images = await self.place_image_repo.filter(place_id=place_id)
        all_image_paths = [image.path for image in images]
        images: list = Utils.get_images(all_image_paths)
        return images[0]
