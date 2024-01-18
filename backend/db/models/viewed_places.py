from datetime import datetime
import uuid
from sqlalchemy import UUID, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.db.base_class import Base


class ViewedPlace(Base):
    __tablename__ = "viewed_places"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    place_id: Mapped[int] = mapped_column(Integer, ForeignKey("places.id"), nullable=False, index=True)
    date_last_viewed: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

