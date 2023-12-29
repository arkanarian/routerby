from backend.tkq import broker

@broker.task(schedule=[{"cron": "*/5 * * * *", "args": [1]}])
async def heavy_task(value: int) -> int:
    # проверяет все кредиты у которых статус approved и платит снимает деньги со счетов
    return value + 1