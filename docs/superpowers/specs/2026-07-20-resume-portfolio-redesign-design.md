# 이력서 · 포트폴리오 개편 설계

날짜: 2026-07-20

## 배경 / 목적

- 이력서(노션)는 "무엇을 했고 어떤 결과가 나왔는지"를 프로젝트당 2~3줄 불릿으로 보여주도록 개편한다. (현재는 프로젝트당 "주요 성과" 1줄 요약)
- 포트폴리오(노션 + 웹사이트)는 기존 Problem-Action-Result 형식을 유지하되, HOLA 2.0 섹션에 신규 경험 4가지를 상세히 추가한다.
- 대상 범위: 노션 이력서 페이지, 노션 포트폴리오 페이지, 웹사이트 저장소(`src/App.tsx`의 `hola2` 데이터). 웹사이트 코드 구조·컴포넌트는 변경하지 않고 데이터만 갱신한다.
- 진행 방식: 이 스펙 문서에 확정된 문구를 그대로 담아, 승인 후 노션/웹사이트에 기계적으로 반영한다 (문구 검토와 반영 작업을 분리).

## 정정 사항

- 기존 자료(이력서, 포트폴리오, 웹사이트)에 있는 "Recoil → Zustand" 상태관리 마이그레이션 서술은 사실과 다름. 실제 전환 대상은 **Jotai**이며, 모든 Zustand 언급(제목, 본문, 코드 스냅샷, `tech` 배열)을 Jotai 기준으로 정정한다.
- 웹사이트 코드 스냅샷(`code.beforeCode`/`afterCode`, atom/selector → store 예시)도 Jotai atom 기준 코드로 재작성한다.

## HOLA 2.0 신규 경험 4가지 (사실관계)

1. **OTDR 프로젝트 통합 (pnpm 모노레포 전환)**: 이미 개발되어 있던 OTDR 프로젝트가 HOLA에 편입되며 같은 메뉴/라우팅, 인증 모듈, 토큰 갱신, UI look & feel을 공유해야 했음. HOLA는 Next.js, OTDR은 Vite+React로 스택이 달랐음. pnpm workspace로 먼저 통합한 뒤 공통 모듈을 점진적으로 추출. 결과적으로 공통 네비게이션/인증 모듈을 한 곳만 수정해도 양쪽에 반영되는 구조 확보. 어려웠던 점: CI/배포 경로 수정, Next/React 공유 컴포넌트 간 차이 대응, 기존 git 이력 보존. 빌드 시간 개선은 측정하지 않아 언급하지 않음.
2. **테스트 코드 도입 (페이지별 통합 테스트 + CRUD 템플릿)**: SKT 보안 정책 강화로 소스코드 취약점 검사가 잦아졌고, AG Grid/Next.js/React 등 핵심 패키지 업데이트 시 전수 수동 테스트가 필요했음(약 1일 소요). Jest + Testing Library로 페이지별 통합 테스트 구축, 생성/조회/수정/삭제(CRUD) 공통 템플릿화 후 도메인별 커스터마이징. 결과: 검증 시간 1일 → 5분.
3. **AI Aside 기반 배포 전 E2E 검증 자동화**: QA 팀 없이 개발자가 QA를 겸임하는 구조. Jira 릴리즈에 여러 수정사항이 한 번에 묶여 배포되며 수정 누락, 운용자 발견 버그(PN 이슈)가 발생. AI 브라우저 에이전트 [Aside](https://aside.com/)를 도입해 배포 전날 Jira 릴리즈 목록을 가져와 항목별로 검증하고 캡처/수정 내용을 자동 기록. 결과: PN 이슈 월평균 10건 → 0~1건. 배포 전 확인 절차도 간소화.
4. **레거시 툴체인 현대화 (npm → pnpm)**: npm에서 pnpm으로 전환 과정에서 무엇을 위한 것인지도 몰랐던 postinstall 스크립트들의 존재를 발견. 그중 콘솔에 불필요한 광고성 메시지를 출력하는 등 실질적으로 불필요한 것은 제거하고, 필요한 것만 남기거나 추가. 같은 시기 Recoil → Jotai 전환도 진행(상세는 정정된 상태관리 마이그레이션 항목 참고). 러닝포인트: 의존성 설치 시 내가 인지하지 못한 채 실행되던 postinstall의 존재를 인지 — 이후 패키지 도입 시 postinstall까지 검토하는 습관 형성.

## 이력서 — HOLA 2.0 불릿 (최종 순서, 프로젝트당 2줄)

노션 이력서의 HOLA 2.0 "주요 성과" 1줄 요약을 아래 6개 불릿으로 교체한다.

1. **대용량 실시간 데이터 처리 + 메모리 최적화**
   V8 힙 구조 분석 및 불필요한 객체 생성 억제로 수천 대 장비의 실시간 데이터 처리 시 메모리 누수 차단. JS 힙 사용량 382MB → 25.7MB로 감소, GC 부하 완화로 프레임 드랍 없는 대시보드 안정화.
2. **OTDR 프로젝트 통합 — pnpm 모노레포 전환**
   Next.js(HOLA)와 Vite+React(OTDR) 별도 프로젝트를 pnpm 워크스페이스 모노레포로 통합, 네비게이션·인증·토큰 갱신·UI를 공통 모듈화. 기존 git 이력을 보존하며 점진 전환, 한 번의 수정이 양쪽에 반영되는 구조 확보.
3. **테스트 코드 도입 — 페이지별 통합 테스트 + CRUD 템플릿**
   보안 취약점 대응으로 잦아진 AG Grid/Next.js/React 등 주요 패키지 업데이트에 대응해 Jest/Testing Library 기반 페이지별 통합 테스트 구축, 생성·조회·수정·삭제 공통 템플릿화. 패키지 업데이트 시 검증 시간 1일 → 5분으로 단축.
4. **AI Aside 기반 배포 전 E2E 검증 자동화**
   QA 인력 부재 환경에서 AI 브라우저 에이전트 Aside를 도입해 배포 전날 Jira 릴리즈 목록 기반 자동 검증 체계 구축. 운용자 발견 버그(PN 이슈) 월평균 10건 → 0~1건으로 감소.
5. **레거시 스택 현대화 — npm → pnpm, Recoil → Jotai**
   npm에서 pnpm으로 전환하며 불필요한 postinstall 스크립트 제거, Recoil을 Jotai로 마이그레이션. 빌드·설치 효율 개선 및 상태 관리 코드 단순화.
6. **Vue → React 기술 전환**
   레거시 Vue 프로젝트를 React 기반 최신 스택으로 점진 마이그레이션. 기술 스택 통일로 코드 공유 및 유지보수 효율 확보.

기존 이력서의 다른 프로젝트(CloudXPM, WatchMAN+, 중계기 대시보드)의 성과 서술 자체는 이번 개편 범위에 포함하지 않는다 (문구 변경 없음). 단, 아래 "이력서 딥링크" 절의 링크는 추가한다.

## 이력서 딥링크 (자세히 보기)

웹사이트(`src/App.tsx` + `ProjectCard.tsx`)에는 이미 프로젝트 카드 앵커(`project-hola2`, `project-cloudxpm`, `project-watchman`, `project-gsinstech`)와 HOLA 2.0의 achievement별 앵커(`hola2-achievement-{index}`, 0-indexed)가 구현되어 있다. 이를 활용해 이력서에서 포트폴리오 웹사이트로 바로 이동하는 링크를 추가한다.

- **프로젝트 제목 단위**: 이력서의 각 프로젝트 제목(HOLA 2.0, CloudXPM, WatchMAN+, 중계기 상태 대시보드) 옆에 "자세히 보기" 링크를 추가해 `https://leeseungjae00.github.io/portfolio/#project-{id}`로 연결한다.
  - HOLA 2.0 → `#project-hola2`
  - CloudXPM → `#project-cloudxpm`
  - WatchMAN+ → `#project-watchman`
  - 중계기 상태 대시보드 → `#project-gsinstech`
- **HOLA 2.0 불릿 단위**: 위 6개 불릿 각각에 대응하는 achievement 앵커로 직접 링크한다. 새 `hola2.achievements` 배열 순서(1 → 2 → 4 → 5 → 6 → 7 → 3, 0-indexed)를 기준으로 매핑:
  - 불릿 1 (대용량 실시간 데이터 처리 + 메모리 최적화) → `#hola2-achievement-0`
  - 불릿 2 (OTDR 프로젝트 통합 — pnpm 모노레포 전환) → `#hola2-achievement-2`
  - 불릿 3 (테스트 코드 도입) → `#hola2-achievement-3`
  - 불릿 4 (AI Aside 기반 배포 전 E2E 검증 자동화) → `#hola2-achievement-4`
  - 불릿 5 (레거시 스택 현대화 — npm→pnpm, Recoil→Jotai) → `#hola2-achievement-5` (npm→pnpm 항목 앵커. 해당 포트폴리오 항목이 Jotai 항목과 상호 참조하므로 별도 두 번째 링크는 추가하지 않는다)
  - 불릿 6 (Vue → React 기술 전환) → `#hola2-achievement-6`
- 링크 텍스트는 각 불릿 끝에 `[자세히 보기](URL)` 형태로 덧붙인다.
- 이 앵커 매핑은 웹사이트 achievements 배열 순서가 확정된 뒤(구현 단계) 실제 index로 다시 검증한다 — 배열 순서가 바뀌면 앵커 index도 함께 바뀌므로, 구현 시 두 파일(이력서 텍스트, `App.tsx` 배열 순서)을 같은 커밋에서 동기화한다.

## 포트폴리오 — HOLA 2.0 섹션 (노션 + 웹사이트 공통, 총 7개 achievement)

기존 3개 achievement를 유지하되 2번은 Jotai로 정정, 신규 4개를 추가한다. 웹사이트 반영 시 신규 4개 achievement는 `metrics`/`screenshots`/`code` 필드 없이 `title`/`problem`/`action`/`result`(+ 기술적 깊이는 `action`/`result` 서술에 자연스럽게 녹이거나 별도 텍스트로 추가)만 채운다.

1. 대용량 실시간 데이터 처리 + 메모리 최적화 — **변경 없음** (기존 Problem/Action/Result, 코드 스냅샷, 이미지 유지)
2. **[정정] Recoil → Jotai 상태 관리 마이그레이션** — 기존 "Recoil → Zustand" 항목의 제목/본문/코드 스냅샷을 Jotai 기준으로 재작성 (구현 계획 단계에서 상세 코드 작성)
3. Vue → React 기술 전환 — **변경 없음**, 다만 섹션 내 노출 순서는 최하단으로 이동
4. **[신규] OTDR 프로젝트 통합 — pnpm 모노레포 전환**
   - Problem: 이미 개발되어 있던 신규 프로젝트 OTDR이 HOLA에 편입. 같은 메뉴·라우팅, 인증 모듈, 토큰 갱신 로직, UI look & feel을 공유해야 했으나 HOLA(Next.js)와 OTDR(Vite+React)이 별도 코드베이스로 존재해 공통 로직 중복 발생
   - Action: pnpm workspace 기반 모노레포로 우선 통합한 뒤, 공통 모듈(네비게이션, 인증, 토큰 갱신, 디자인 시스템)을 점진적으로 추출해 공유 패키지화. 기존 git 커밋 이력을 보존하며 전환, Next.js와 React(Vite) 간 컴포넌트 구현 차이를 흡수하는 공유 컴포넌트 경계 설계
   - Result: 네비게이션·인증 모듈 일원화로 한 곳만 수정해도 두 프로젝트에 동시 반영되는 구조 확보. 코드 중복 제거로 유지보수 비용 감소
   - 기술적 깊이: CI/배포 경로 재구성, 프레임워크가 다른 두 앱 간 공유 컴포넌트의 구현 차이 대응, 히스토리 보존 전략 수립
5. **[신규] 테스트 코드 도입 — 페이지별 통합 테스트 + CRUD 템플릿**
   - Problem: SKT의 보안 정책 강화로 소스코드 취약점 검사가 잦아졌고, AG Grid·Next.js·React 등 핵심 패키지에서 취약점이 발견될 때마다 업데이트 후 전 페이지 수동 전수 테스트가 필요해 하루가 소요됨
   - Action: Jest + Testing Library로 페이지별 통합 테스트 구축. 생성·조회·수정·삭제(CRUD) 공통 테스트 템플릿을 만들고, 각 도메인 특성에 맞게 커스터마이징하는 방식으로 작성 효율화
   - Result: 패키지 업데이트 시 검증 시간 1일 → 5분으로 단축
   - 기술적 깊이: 템플릿 기반 테스트 설계로 신규 페이지 대응 비용 최소화, 회귀 테스트 자동화 체계 구축
6. **[신규] AI Aside 기반 배포 전 E2E 검증 자동화**
   - Problem: QA 팀 없이 개발자가 QA를 병행하는 구조에서, Jira 릴리즈에 버그 수정·신규 기능이 한 번에 여러 건 묶여 배포되다 보니 수정 누락이나 운용자가 발견하는 버그(PN 이슈)가 잦았음
   - Action: AI 브라우저 에이전트 [Aside](https://aside.com/)를 도입해 배포 전날 Jira 릴리즈 목록을 가져와 항목별로 직접 검증, 캡처와 수정 내용을 자동 기록하는 프로세스 구축
   - Result: 운용자 발견 버그(PN 이슈) 월평균 10건 → 0~1건으로 감소, 배포 전 확인 절차 간소화
   - 기술적 깊이: QA 부재를 AI 에이전트 협업으로 보완, Jira 연동 기반 릴리즈 검증 워크플로우 설계
7. **[신규] 레거시 툴체인 현대화 — npm → pnpm 전환**
   - Problem: npm에서 pnpm으로 전환하는 과정에서, 정작 어떤 패키지가 무엇을 위해 실행하는지도 몰랐던 postinstall 스크립트들의 존재를 발견. 그중 콘솔에 불필요한 광고성 메시지를 출력하는 등 실질적으로 필요 없는 postinstall이 다수 포함되어 있었음
   - Action: 전체 postinstall 스크립트를 점검해 불필요한 것(광고성 출력 등)은 제거하고, 실제로 필요한 것만 남기거나 추가
   - Result: 설치 과정 정리, 불필요한 스크립트 실행 제거로 install 효율 개선
   - 러닝 포인트: 의존성 설치 과정에서 내가 인지하지 못한 채 실행되고 있던 postinstall의 존재를 인지 — 패키지 도입 시 postinstall 스크립트까지 검토해야 한다는 습관 형성. (같은 시기 Recoil → Jotai 전환도 함께 진행 — 상세는 2번 항목 참고)

섹션 내 노출 순서: 1 → 2 → 4 → 5 → 6 → 7 → 3 (Vue→React 최하단).

## 웹사이트(`src/App.tsx`) 반영 방식

- `hola2.achievements` 배열의 순서를 위 섹션 노출 순서(1 → 2 → 4 → 5 → 6 → 7 → 3)에 맞게 재배열한다.
- 기존 achievement 2번(현재 "Recoil → Zustand 상태 관리 마이그레이션")의 `title`/`problem`/`action`/`result`/`code.title`/`code.beforeCode`/`code.afterCode`/`code.beforeCaption`/`code.afterCaption`을 Jotai 기준으로 재작성한다. `metrics`(번들 사이즈 등)는 실측치가 없으므로 구현 단계에서 유지 여부를 판단한다(허수 수치 생성 금지 — 실측 안 된 값은 텍스트 서술로 대체하거나 생략).
- 신규 4개 achievement는 `Achievement` 타입 중 `title`/`problem`/`action`/`result`만 채우고 `metrics`/`screenshots`/`code`는 생략한다.
- `hola2.tech` 배열에서 `Zustand`를 `Jotai`로 교체하고, `pnpm` 태그 추가를 검토한다.
- 웹사이트 텍스트는 위 포트폴리오 섹션의 문구를 그대로 사용한다(별도 재작성 없음).

## 노션 반영 방식

- 이력서 페이지: HOLA 2.0 "주요 성과" 1줄을 위 6개 불릿으로 교체. 다른 프로젝트 섹션은 변경하지 않음.
- 포트폴리오 페이지: HOLA 2.0 섹션의 achievement 2번을 Jotai로 정정(코드 스냅샷 포함 재작성), Vue→React를 섹션 최하단으로 이동, 신규 4개 achievement를 노션 콜아웃/컬럼 포맷(기존 스타일)에 맞춰 추가.

## 범위 밖

- CloudXPM, WatchMAN+, 중계기 대시보드, Side Projects 섹션은 이번 개편에서 수정하지 않는다.
- 웹사이트의 컴포넌트 구조(`ProjectCard.tsx` 등)나 스타일은 변경하지 않는다. 데이터(`App.tsx`의 `hola2` 객체)만 갱신한다.
- 신규 achievement에 대한 스크린샷/이미지 자산은 없으므로 추가하지 않는다.
- 이력서의 "🛠 Core Skills" 목록에 pnpm/Jotai 반영 여부는 구현 계획 단계에서 별도 확인한다.
