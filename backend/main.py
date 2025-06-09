import time
from fastapi import FastAPI, Request, status
from routers import category_router, question_router, subcategory_router, problem_router, auth_router, subcategory_question_router, category_question_router, question_count_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import Page, add_pagination, paginate
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, RedirectResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def handler(request:Request, exc:RequestValidationError):
    return JSONResponse(content={}, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

# 例えば、リクエストの処理とレスポンスの生成にかかった秒数を含むカスタムヘッダー X-Process-Time を追加できます:
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

app.include_router(auth_router.router)
app.include_router(category_router.router)
app.include_router(subcategory_router.router)
app.include_router(question_router.router)
app.include_router(question_count_router.router)
app.include_router(problem_router.router)
app.include_router(category_question_router.router)
app.include_router(subcategory_question_router.router)
add_pagination(app)
