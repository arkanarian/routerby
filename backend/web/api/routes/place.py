from fastapi import APIRouter, Depends, File, Response, UploadFile
from fastapi.responses import FileResponse
from starlette.status import HTTP_201_CREATED

from backend.db.auth import get_current_user
from backend.db.models.user import User
from backend.db.repository.place_repository import PlaceRepository, get_place_repository

from backend.schemas.place import PlaceAlias, PlaceAll, PlaceCreate, PlaceEntity, PlaceIds, PlaceInDB
from backend.services.place_service import PlaceService


router = APIRouter()

@router.post("", response_model=PlaceInDB, status_code=HTTP_201_CREATED)
async def create_place(
    payload: PlaceCreate,
    place_service: PlaceService = Depends(),
    user: User = Depends(get_current_user),
) -> PlaceInDB:
    """
    Create new place.
    """
    place = await place_service.create_place(place_data=payload)
    return place


@router.get("", response_model=list[PlaceAll])
async def get_places(
    place_service: PlaceService = Depends(),
    user: User = Depends(get_current_user),
    limit: int = 10,
    offset: int = 0,
) -> list[PlaceAll]:
    """
    Get all places.
    """
    places = await place_service.get_all(user, limit, offset)
    return places


@router.post("/upload_image")
def upload(file: UploadFile):
    try:
        contents = file.file.read()
        with open(f"backend/static/images/{file.filename}", 'wb') as f:
            f.write(contents)
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
        file.file.close()

    return {"message": f"Successfully uploaded {file.filename}"}


@router.post("/get_by_ids", response_model=list[PlaceEntity])
async def get_places_by_ids(
    payload: PlaceIds,
    # place_service: PlaceService = Depends(),
    place_repo: PlaceRepository = Depends(get_place_repository),
    user: User = Depends(get_current_user),
) -> list[PlaceEntity]:
    """
    Get all places by ids.
    """
    places = await place_repo.select_in_ids(payload.ids)
    print(places)
    return places


@router.post("/get_by_alias", response_model=PlaceEntity)
async def get_place_by_alias(
    payload: PlaceAlias,
    place_repo: PlaceRepository = Depends(get_place_repository),
    user: User = Depends(get_current_user),
) -> PlaceEntity:
    """
    Get all places by ids.
    """
    place = await place_repo.get_by_alias(payload.alias)

    # FIXME: bad, erase
    place = PlaceEntity.model_validate(place)
    place.images.sort()

    return place

# TODO: multiple images response
# @router.get("/{place_id}/images",
#     responses = {
#         200: {
#             "content": {"image/png": {}}
#         }
#     },
#     response_class=Response
# )
# async def get_place_images(
#     place_id: int,
#     place_service: PlaceService = Depends(),
#     user: User = Depends(get_current_user),
# ) -> Response:
#     """
#     Get all images of place.
#     """
#     images = await place_service.get_images(place_id=place_id)
#     return images


@router.get("/image", response_class=FileResponse)
async def get_place_image(
    file_name: str,
    user: User = Depends(get_current_user),
) -> FileResponse:
    """
    Get image of place.
    """
    return f"backend/static/images/{file_name}"
