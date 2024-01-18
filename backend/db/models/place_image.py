import uuid
from sqlalchemy import UUID, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.db.base_class import Base


class PlaceImage(Base):
    __tablename__ = "place_images"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    path: Mapped[str] = mapped_column(String(length=255), nullable=False, index=True)
    place_id: Mapped[int] = mapped_column(Integer, ForeignKey("places.id"), nullable=False, index=True)

    place: Mapped["Place"] = relationship("Place", back_populates="images")
