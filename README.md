# zkeep front

지킴E 관리 웹 — 점검업체 관리자(`/management`)와 플랫폼 운영자(`/admin`)용. Vue 3 + Vite + TypeScript + Element Plus.
프로젝트 전체 설명은 [back/docs/PROJECT.md](https://github.com/elzkeep/back/blob/main/docs/PROJECT.md).

```sh
pnpm install
pnpm dev          # http://localhost:4000 → API http://localhost:9303 (.env.development)
pnpm release      # 운영 빌드 (vite build --mode production) → dist 를 back 이 서빙
```

- `src/models/*.ts` — API 모델(대부분 생성 코드), `extra.ts`·`signup.ts`·`login.ts` 는 수기
- `src/views/management/*` 업체 화면, `src/views/admin/*` 운영자 화면, `src/router/index.ts` 라우트·권한
- 로그인 `POST /api/jwt`, 회원가입 `/api/signup/*` (서버가 레벨·승인을 정한다)
- 타입 검사(`pnpm build` 의 `vue-tsc`)는 도구 버전 불일치로 실패 — 배포는 `pnpm release`
