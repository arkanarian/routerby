import uuid

from fastapi import Depends
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.dependencies import get_db
from backend.db.models.user import User
from backend.schemas.user_manager import UserManager
from backend.settings import settings


async def get_user_db(
    session: AsyncSession = Depends(get_db),
) -> SQLAlchemyUserDatabase:
    """
    Yield a SQLAlchemyUserDatabase instance.

    :param session: asynchronous SQLAlchemy session.
    :yields: instance of SQLAlchemyUserDatabase.
    """
    yield SQLAlchemyUserDatabase(session, User)


async def get_user_manager(
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
) -> UserManager:
    """
    Yield a UserManager instance.

    :param user_db: SQLAlchemy user db instance
    :yields: an instance of UserManager.
    """
    yield UserManager(user_db)


def get_jwt_strategy() -> JWTStrategy:
    """
    Return a JWTStrategy in order to instantiate it dynamically.

    :returns: instance of JWTStrategy with provided settings.
    """
    return JWTStrategy(secret=settings.users_secret, lifetime_seconds=None)


# cookie_transport = CookieTransport(cookie_name="routerby", cookie_max_age=3600000)
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

auth_jwt = AuthenticationBackend(
    name="jwt",
    # transport=cookie_transport,
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

backends = [
    auth_jwt,
]

api_users = FastAPIUsers[User, uuid.UUID](get_user_manager, backends)

current_user = api_users.current_user(active=True)
current_superuser = api_users.current_user(active=True, superuser=True)
