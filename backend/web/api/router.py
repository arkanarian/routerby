from fastapi.routing import APIRouter

from backend.web.api import redis
from backend.web.api.routes import user_router

api_router = APIRouter()
api_router.include_router(user_router)
# api_router.include_router(account_router, prefix="/accounts", tags=["accounts"])
# api_router.include_router(card_router, prefix="/cards", tags=["cards"])
# api_router.include_router(credit_router, prefix="/credits", tags=["credits"])
# api_router.include_router(transaction_router, prefix="/transactions", tags=["transactions"])
api_router.include_router(redis.router, prefix="/redis", tags=["redis"])
