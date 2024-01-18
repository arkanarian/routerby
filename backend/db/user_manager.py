import datetime
import random
import uuid
from typing import Optional
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema

from fastapi_users import BaseUserManager, UUIDIDMixin
from starlette.requests import Request
from starlette.responses import Response

from backend.db.models.user import User
from backend.settings import settings

class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    """Manages a user session and its tokens."""

    reset_password_token_secret = settings.users_secret
    verification_token_secret = settings.users_secret

    def __init__(
        self, 
        user_db,
        password_helper = None,
    ):
        super().__init__(user_db, password_helper)
        # self.conf = ConnectionConfig(
        #     MAIL_USERNAME="winjoskin6@gmail.com",
        #     MAIL_PASSWORD="Dhjwkfd201Jgjkt!:)",
        #     MAIL_FROM="winjoskin6@gmail.com",
        #     MAIL_PORT=587,
        #     MAIL_SERVER="smtp.gmail.com",
        #     MAIL_FROM_NAME="Verify",
        #     MAIL_SSL_TLS=False,
        #     MAIL_STARTTLS=True,
        #     USE_CREDENTIALS=True,
        #     TEMPLATE_FOLDER='./backend/schemas/templates'
        # )
        # self.account_repo: AccountRepository = get_account_repository()
        # self.card_repo: CardRepository = get_card_repository()

    async def on_after_register(
        self, 
        user: User, 
        request: Optional[Request] = None,
    ):
        # account = await self.account_repo.create_with_user(user_id=user.id)
        # card_in = CardInCreate(
        #     card_number=str(random.randint(1000000000000000, 9999999999999999)),
        #     cvv=str(random.randint(100, 999)),
        #     date_start=datetime.datetime.now(),
        #     date_end=datetime.datetime.now() + datetime.timedelta(days=365 * 5),
        # )
        # await self.card_repo.create_with_owner(card_in=card_in, account_id=account.id)
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self,
        user: User,
        token: str,
        request: Optional[Request] = None,
    ):
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self,
        user: User,
        token: str,
        request: Optional[Request] = None,
        # user_service: UserService = Depends(),
    ):
        # await user_service.send_email_background(
        #     subject="Verify your email",
        #     email_to=user.email,
        #     body={
        #         "username": user.username,
        #         "verify_link": "{token}",
        #     },
        # )

        message = MessageSchema(
            subject="Verify your email",
            recipients=[user.email],
            body={
                "username": user.username,
                "verify_code": "{token}",
            },
            subtype='html',
        )
        fm = FastMail(self.conf)
        fm.send_message(message, template_name='email.html')
        print(f"Verification requested for user {user.id}. Verification token: {token}")

    async def on_after_login(
        self,
        user: User,
        request: Optional[Request] = None,
        response: Optional[Response] = None,
    ) -> None:
        """
        Perform logic after user login.

        *You should overload this method to add your own logic.*

        :param user: The user that is logging in
        :param request: Optional FastAPI request
        :param response: Optional response built by the transport.
        Defaults to None

        Тут формировать TOTP код и отправлять на почту
        """
        print(f"User {user.id} has logged in.")
