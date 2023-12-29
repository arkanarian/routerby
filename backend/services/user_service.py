import base64
import io
import smtplib, ssl
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema

import pyotp
import qrcode
from fastapi import Depends


from backend.db.models.user import User
from backend.db.dao.user_dao import UsersRepository, get_users_repository
from backend.settings import settings


class UserService:
    def __init__(
        self,
        user_repo: UsersRepository = Depends(get_users_repository),
    ) -> None:
        self.user_repo = user_repo
        self.totp_email = pyotp.TOTP(settings.users_secret, interval=300)  # 5 minutes


    @staticmethod
    def two_fa_generate_uri(user: User):
        totp = pyotp.TOTP(settings.users_secret)
        uri = totp.provisioning_uri(user.username, issuer_name="Routerby")
        return uri
    
    @staticmethod
    def two_fa_verify(code: str):
        totp = pyotp.TOTP(settings.users_secret)
        print(totp.now())
        return totp.verify(code)

    @staticmethod
    def generate_qr_code(uri: str):
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(uri)
        qr.make(fit=True)

        qr_image = qr.make_image(fill_color="black", back_color="white")

        # Convert the image to bytes format
        # f = qr_image.read()
        # b = bytearray(f)
        # image_bytes = b[0]
        image_bytes = io.BytesIO()
        qr_image.save(image_bytes)
        image_bytes.seek(0)
        # image_bytes = image_bytes.read()
        base64_image = base64.b64encode(image_bytes.read()).decode("utf-8")

        return base64_image
    
    def generate_totp_email(self):
        return self.totp_email.now()
    
    def verify_totp_email(self, code: str):
        print(self.totp_email.now())
        return self.totp_email.verify(code)
    
    async def send_email(self, user: User, code: str):
        SMTP_SERVER="smtp.gmail.com"
        SENDER_EMAIL="imacsus@gmail.com"
        SENDER_PASS="huvv vvrc iaok dqfa"
        SSL_PORT=465

        context = ssl.create_default_context()
        server = smtplib.SMTP_SSL(SMTP_SERVER, SSL_PORT, context=context)
        server.login(SENDER_EMAIL, SENDER_PASS)
        server.sendmail(SENDER_EMAIL, "max1112vas@gmail.com", code)

        # conf = ConnectionConfig(
        #     MAIL_USERNAME="Winjoskin6",
        #     MAIL_PASSWORD="huvv vvrc iaok dqfa",
        #     MAIL_FROM="imacsus@gmail.com",
        #     MAIL_PORT=587,
        #     MAIL_SERVER="smtp.gmail.com",
        #     MAIL_FROM_NAME="Verify",
        #     MAIL_SSL_TLS=False,
        #     MAIL_STARTTLS=True,
        #     # USE_CREDENTIALS=True,
        #     TEMPLATE_FOLDER='./backend/schemas/templates'
        # )

        # message = MessageSchema(
        #     subject="Verify your email",
        #     # recipients=[user.email],
        #     recipients=['max1112vas@gmail.com'],
        #     template_body={
        #         "title": "Verify your email",
        #         "username": user.username,
        #         "verify_code": message,
        #     },
        #     subtype='html',
        # )
        # fm = FastMail(conf)
        # await fm.send_message(message, template_name='email.html')
        # print(f"Verification requested for user {user.id}. Verification token: {message}")
        # )

    
    # async def send_email_background(self, subject: str, email_to: str, body: dict):
    #     message = MessageSchema(
    #         subject=subject,
    #         recipients=[email_to],
    #         body=body,
    #         subtype='html',
    #     )
    #     fm = FastMail(self.conf)
    #     fm.send_message(message, template_name='email.html')

    # def two_fa_verify(code: str):
    #     # generate verification TOTP code
    #     totp = pyotp.TOTP(settings.users_secret)
    #     # check if provided code is correct
    #     if not totp.verify(code):
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="Invalid authentication credentials",
    #             headers={"WWW-Authenticate": "Bearer"},
    #         )
    #     # if code is correct, generate and return JWT token
    #     access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    #     access_token = create_access_token(
    #         data={"sub": user.username}, expires_delta=access_token_expires
    #     )
    #     return {"access_token": access_token, "token_type": "bearer"}

    # def authenticate(self, token: str) -> User:
    #     """
    #     Authenticate user.
    #     Validate token
    #     """

    #     credentials_exception = HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Could not validate credentials",
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )
    #     try:
    #         payload = jwt.decode(
    #             token, security.SECRET_KEY, algorithms=[security.ALGORITHM]
    #         )
    #         email: str = payload.get("sub")
    #         if email is None:
    #             raise credentials_exception
    #         permissions: str = payload.get("permissions")
    #         token_data = TokenData(email=email, permissions=permissions)
    #     except jwt.PyJWKError:
    #         raise credentials_exception
    #     user = get_user_by_email(db, token_data.email)
    #     if user is None:
    #         raise credentials_exception
    #     return user
    # user = self.user_repo.get_by_username(username=username)
    # if not user:
    #     raise UserNotFoundException(
    #         message=f"User with username: `{username}` not found",
    #         status_code=HTTP_401_UNAUTHORIZED,
    #     )
    # if not verify_password(
    #     plain_password=password, hashed_password=user.hashed_password
    # ):
    #     raise InvalidUserCredentialsException(
    #         message="Invalid credentials", status_code=HTTP_401_UNAUTHORIZED
    #     )
    # return user

    # bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")
    # auth_jwt = AuthenticationBackend(
    #     name="jwt",
    #     transport=bearer_transport,
    #     get_strategy=get_jwt_strategy,
    # )

    # backends = [
    #     auth_jwt,
    # ]

    # api_users = FastAPIUsers[User, uuid.UUID](get_user_manager, backends)

    # user = api_users.current_user(active=True)
