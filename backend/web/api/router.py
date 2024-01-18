from fastapi.routing import APIRouter

from backend.web.api import redis
from backend.web.api.routes import user_router, place_router, city_router, district_router, place_type_router

api_router = APIRouter()
api_router.include_router(user_router)
api_router.include_router(place_router, prefix="/places", tags=["places"])
api_router.include_router(city_router, prefix="/cities", tags=["cities"])
api_router.include_router(district_router, prefix="/districts", tags=["districts"])
api_router.include_router(place_type_router, prefix="/place_types", tags=["place_types"])
api_router.include_router(redis.router, prefix="/redis", tags=["redis"])
