import taskiq_fastapi
from taskiq import InMemoryBroker, TaskiqScheduler
from taskiq_redis import ListQueueBroker, RedisAsyncResultBackend
from taskiq.schedule_sources import LabelScheduleSource

from backend.settings import settings

# хранит результаты выполнения задач в редисе
result_backend = RedisAsyncResultBackend(
    redis_url=str(settings.redis_url.with_path("/1")),
)
broker = ListQueueBroker(
    str(settings.redis_url.with_path("/1")),
).with_result_backend(result_backend)

if settings.environment.lower() == "pytest":
    broker = InMemoryBroker()

taskiq_fastapi.init(
    broker,
    "backend.web.application:get_app",
)

scheduler = TaskiqScheduler(
    broker=broker,
    sources=[LabelScheduleSource(broker)],
)
