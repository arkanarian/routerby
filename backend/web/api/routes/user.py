from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from backend.db.auth import api_users, auth_jwt, get_user_manager  # type: ignore
from backend.db.auth import current_superuser, current_user
from backend.db.models.user import User
from backend.db.dao.user_dao import UsersRepository, get_users_repository
from backend.schemas.user import (  # type: ignore
    UserCreate,
    UserRead,
    UserUpdate,
)
from backend.schemas.user_manager import UserManager
from starlette import status
from backend.services.user_service import UserService  # type: ignore

router = APIRouter()

class EmailStr(BaseModel):
    email: str

@router.post(
    "/users/get_qr_code",
    tags=["users"],
    responses = {
        200: {
            "content": {"image/png": {}}
        }
    },
    response_class=Response,
)
async def get_qr_code(
    # credentials: OAuth2PasswordRequestForm = Depends(),
    email: EmailStr,
    # user_manager: UserManager = Depends(get_user_manager),
    user_repository: UsersRepository = Depends(get_users_repository),
):
    """
    Запросили креды пользователя
    Вернули success
    Дальше фронт вызывает otp/generate и otp/verify
    Если код подтверждается, возвращается success
    Дальше фронт запрашивает генерацию jwt токена и сохраняет в куках
    """
    # print(credentials.__dict__)
    # user = await user_manager.authenticate(credentials)
    user = await user_repository.get_by_email(email.email)

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="LOGIN_BAD_CREDENTIALS",
        )

    uri: str = UserService.two_fa_generate_uri(user)
    qr_code: bytes = UserService.generate_qr_code(uri)
    # return Response(content=qr_code, media_type="image/png")
    return Response(content=qr_code)

class CodeStr(BaseModel):
    code: str

@router.post(
    "/users/verify_code",
    response_class=Response,
    tags=["users"],
)
async def login(
    request: Request,
    code: str,
    credentials: OAuth2PasswordRequestForm = Depends(),
    user_manager: UserManager = Depends(get_user_manager),
):
    backend = auth_jwt
    user = await user_manager.authenticate(credentials)

    is_valid_code = UserService.two_fa_verify(code)
    if user is None or not user.is_active or not is_valid_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="LOGIN_BAD_CREDENTIALS",
        )
    response = await backend.login(backend.get_strategy(), user)
    await user_manager.on_after_login(user, request, response)
    return response


@router.post("/users/email/send_verify", tags=["users"])
async def send_verify(
    user_service: UserService = Depends(),
    user: User = Depends(current_user),
):
    code = user_service.generate_totp_email()
    await user_service.send_email(user, code)
    # user = await user_manager.verify_email(token)
    # await user_manager.on_after_request_verify(user, token, request)
    return Response(status_code=status.HTTP_200_OK)

@router.post("/users/email/verify", tags=["users"])
async def verify(
    user_service: UserService = Depends(),
    user: User = Depends(current_user),
    code: str = None,
):
    is_verified = user_service.verify_totp_email(code)
    if not is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="LOGIN_BAD_CREDENTIALS",
        )
    return Response(status_code=status.HTTP_200_OK)


router.include_router(
    api_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)

router.include_router(
    api_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
router.include_router(
    api_users.get_auth_router(auth_jwt),
    prefix="/auth/jwt",
    tags=["auth"],
)
