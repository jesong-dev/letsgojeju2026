# 떠나요 둘이서 · 제주 2026

Let's Jeju 2026
"여행 정보를 전달하는 프로젝트가 아니라, 여행이 시작되는 순간을 만드는 프로젝트."

## 실행

```bash
npm install
npm run dev
```

정적 빌드는 다음 명령으로 생성합니다.

```bash
npm run build
npm run preview
```

개발 서버에서 확인할 경로:

- `/` — 현재 공개 버전
- `/v0.4/` — v0.4 공개 당시 브로슈어
- `/v0.5/` — v0.5 인터랙티브 편지
- `/v0.6/` — v0.6 순차 메모 꺼내기
- `/archive/` — 전체 공개 버전

## 다음 버전 추가

1. `src/versions/vX.Y/`에 버전 전용 렌더러와 스타일을 추가합니다.
2. 공개 당시 이미지 파일을 `public/images/vX.Y/`에 넣습니다.
3. `src/core/version-registry.ts`에 버전 메타데이터를 등록합니다.
4. `vX.Y/index.html`을 만들고 `vite.config.ts`의 빌드 입력에 추가합니다.
5. `src/main.ts`에서 버전 렌더러를 연결합니다.
6. `docs/version-history.md`에 결정과 다음 계획을 기록합니다.

과거 버전 전용 CSS는 반드시 버전 루트 클래스 아래에 스코프하고, 공개 뒤에는 최신 공통 스타일에 맞추기 위한 수정은 하지 않습니다.

## GitHub Pages

`main` 브랜치에 push하면 `.github/workflows/deploy-pages.yml`이 프로젝트을 빌드하고 GitHub Pages에 배포합니다.

공개 주소:

```text
https://jesong-dev.github.io/letsgojeju2026/
```

워크플로는 저장소 하위 경로를 Vite base path로 지정합니다.

```bash
VITE_BASE_PATH=/letsgojeju2026/ npm run build
```

Windows PowerShell:

```powershell
$env:VITE_BASE_PATH="/letsgojeju2026/"; npm run build
```

이미지, 버전 링크와 archive 링크는 모두 Vite의 base path를 기준으로 생성되므로 저장소 하위 경로에서도 동작합니다.

## 공개 버전과 Git 태그

공개할 때의 예시:

```bash
git add .
git commit -m "release: v0.5 10월의 제주"
git tag -a v0.5 -m "10월의 제주 공개"
```

웹 경로는 방문자가 과거 화면을 볼 수 있게 하고, Git 태그는 공개 당시의 전체 코드 상태를 보존합니다. 한 번 만든 공개 태그는 수정하거나 같은 이름으로 다시 만들지 않습니다.

## 보존 자료

마이그레이션 전 공개본과 제작 중간본은 `legacy/`에 원문 그대로 복사했습니다. 루트의 기존 중간 파일도 삭제하지 않았습니다.
