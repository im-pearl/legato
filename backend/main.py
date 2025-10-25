from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import analysis, issues, precedents, report

# FastAPI 앱 생성
app = FastAPI(
    title="Legal Review AI API",
    description="Claude AI 기반 법률 검토 자동화 API",
    version="1.0.0",
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(analysis.router, prefix="/api/v1", tags=["1. Analysis"])
app.include_router(issues.router, prefix="/api/v1", tags=["2. Issues"])
app.include_router(precedents.router, prefix="/api/v1", tags=["3. Precedents"])
app.include_router(report.router, prefix="/api/v1", tags=["4. Report"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Legal Review AI API is running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

