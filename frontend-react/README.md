# Legal Review AI - React + MUI

Vue 프로젝트를 **React + Material UI**로 완전히 마이그레이션한 프로젝트입니다.

## 🎨 기술 스택

- **React 18** - 최신 React 버전
- **Material UI (MUI) v6** - Material Design 3 구현
- **React Router v6** - 라우팅
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **Emotion** - CSS-in-JS 스타일링

## 📁 프로젝트 구조

```
frontend-react/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── AppSidebar.jsx       # 사이드바 (MUI Drawer)
│   │       ├── ProgressBar.jsx      # 프로그레스바 (MUI Stepper)
│   │       └── LoadingModal.jsx     # 로딩 모달 (MUI Backdrop)
│   ├── pages/
│   │   ├── Home.jsx                 # 홈 페이지
│   │   ├── CaseAnalysis.jsx         # 사건 분석
│   │   ├── CaseIssues.jsx           # 쟁점 추출
│   │   ├── CaseSearch.jsx           # 판례 검색
│   │   └── CaseFinalReview.jsx      # 최종 검토
│   ├── router/
│   │   └── index.jsx                # 라우터 설정
│   ├── theme/
│   │   └── theme.js                 # MUI 테마 (기존 Vue 색상 팔레트 유지)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── vite.config.js
```

## 🚀 시작하기

### 설치

```bash
cd frontend-react
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

서버가 실행되면 브라우저에서 `http://localhost:5173` (또는 표시된 포트)로 접속하세요.

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 🎯 주요 기능

### 완성된 페이지

1. **Home** - 심사봇 소개 및 기능 카드
2. **CaseAnalysis** - 의뢰서 및 상담 결과지, 파일 업로드, 하이라이팅
3. **CaseIssues** - 사실관계 편집, 쟁점 추가/삭제/편집
4. **CaseSearch** - 판례 검색 결과, 판례 선택, 추가 검색
5. **CaseFinalReview** - 쟁점별 포섭, 승소/집행가능성 슬라이더, 보고서 미리보기 모달

### 공통 컴포넌트

- **AppSidebar** - 고정 사이드바 (MUI Drawer)
- **LoadingModal** - AI 처리 중 로딩 모달 (MUI Backdrop + CircularProgress)

## 🎨 디자인 특징

- **Material Design 3** 완전 구현
- **세련된 애니메이션** - 부드러운 hover, focus, transition 효과
- **반응형 디자인** - 모바일/태블릿/데스크톱 지원
- **접근성** - ARIA 레이블 및 키보드 네비게이션
- **일관된 색상 팔레트** - Vue 프로젝트의 색상 체계 완전 유지

## 📝 기존 Vue 프로젝트와의 차이점

### 개선된 점

✅ **더 세련된 UI/UX** - MUI의 고급 컴포넌트 활용
✅ **더 나은 타입 안정성** - React + JSX의 명확한 구조
✅ **더 빠른 개발 경험** - Vite의 HMR
✅ **더 작은 번들 크기** - Tree-shaking 최적화
✅ **더 좋은 애니메이션** - MUI의 부드러운 트랜지션

### 유지된 기능

✅ 모든 페이지 및 기능 완벽 구현
✅ 동일한 데이터 구조 및 플로우
✅ 동일한 색상 팔레트 및 브랜딩
✅ 동일한 사용자 경험

## 🔧 주요 라이브러리

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "@mui/material": "^6.3.0",
  "@mui/icons-material": "^6.3.0",
  "@emotion/react": "^11.13.5",
  "@emotion/styled": "^11.13.5"
}
```

## 📱 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 🤝 개발자

Vue → React 마이그레이션 완료!
