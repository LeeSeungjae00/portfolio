# 이력서 · 포트폴리오 개편 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** HOLA 2.0의 신규 경험 4가지(모노레포 통합, 테스트 코드 도입, AI Aside E2E 자동화, 레거시 툴체인 현대화)를 웹사이트와 노션 포트폴리오에 추가하고, Recoil→Zustand로 잘못 기재된 부분을 Recoil→Jotai로 정정하며, 노션 이력서를 프로젝트당 불릿 형식 + 딥링크 구조로 개편한다.

**Architecture:** 정적 콘텐츠 3곳(웹사이트 `src/App.tsx`의 `hola2` 데이터, 노션 포트폴리오 페이지, 노션 이력서 페이지)을 순서대로 갱신한다. 웹사이트를 먼저 갱신해 achievement 배열의 실제 인덱스(`hola2-achievement-N` 앵커)를 확정한 뒤, 그 인덱스를 그대로 노션 이력서 딥링크에 반영한다.

**Tech Stack:** React 19 + TypeScript + Vite (웹사이트), Notion (이력서/포트폴리오 페이지, MCP `notion-update-page`/`notion-fetch` 도구로 편집·검증)

## Global Constraints

- 새로 추가하는 4개 achievement(모노레포, 테스트, AI Aside, 레거시 툴체인)는 `metrics`/`screenshots`/`code` 필드 없이 `title`/`problem`/`action`/`result`만 채운다 (스펙 합의 사항, 코드 스니펫 임의 생성 금지).
- 실측하지 않은 수치는 절대 생성하지 않는다. 기존 "Recoil → Zustand" 항목의 "번들 사이즈 96% 감소 (79KB → 2.9KB)" 수치는 Jotai 기준으로 검증되지 않았으므로 삭제하고 정성적 서술로 대체한다.
- `achievements` 배열의 최종 순서는 인덱스 0부터: 메모리 최적화 → Jotai 마이그레이션 → OTDR 모노레포 통합 → 테스트 코드 도입 → AI Aside E2E → 레거시 툴체인 현대화(npm→pnpm) → Vue→React 전환. 이 순서가 바뀌면 앵커 index도 바뀌므로 Task 3의 딥링크와 반드시 동기화한다.
- 이력서 프로젝트 링크: `https://leeseungjae00.github.io/portfolio/#project-{id}` (hola2, cloudxpm, watchman, gsinstech). HOLA 2.0 불릿 링크: `https://leeseungjae00.github.io/portfolio/#hola2-achievement-{index}` (0-indexed).
- 참조 스펙: `docs/superpowers/specs/2026-07-20-resume-portfolio-redesign-design.md`

---

## Task 1: 웹사이트 `hola2` 데이터 갱신 (`src/App.tsx`)

**Files:**
- Modify: `src/App.tsx:7-187` (`hola2` 객체 전체)

**Interfaces:**
- Consumes: `ProjectData`/`Achievement` 타입 (`src/components/ProjectCard.tsx:5-49`, 변경 없음)
- Produces: `hola2.achievements` 배열의 최종 순서와 인덱스 — Task 3(이력서 딥링크)이 그대로 참조하는 값. 최종 인덱스:
  - `0` = 대용량 실시간 데이터 처리 + 메모리 최적화
  - `1` = Recoil → Jotai 상태 관리 마이그레이션
  - `2` = OTDR 프로젝트 통합 — pnpm 모노레포 전환
  - `3` = 테스트 코드 도입 — 페이지별 통합 테스트 + CRUD 템플릿
  - `4` = AI Aside 기반 배포 전 E2E 검증 자동화
  - `5` = 레거시 툴체인 현대화 — npm → pnpm 전환
  - `6` = Vue → React 기술 전환

- [ ] **Step 1: 검증 스크립트로 "아직 반영 안 됨"을 확인**

Run:
```bash
grep -n "Zustand\|OTDR\|hola2-achievement" src/App.tsx src/components/ProjectCard.tsx
```
Expected: `Zustand`가 `tech` 배열과 achievement 제목에 남아있고, `OTDR`은 어디에도 없음 (아직 미반영 상태 확인).

- [ ] **Step 2: `tech` 배열 수정**

`src/App.tsx:11`을 다음으로 교체:

```typescript
  tech: ['Next.js', 'TypeScript', 'React Query', 'Jotai', 'WebSocket', 'Kubernetes', 'Docker', 'AG Grid', 'pnpm', 'Jest', 'Testing Library'],
```

- [ ] **Step 3: `achievements` 배열 전체 교체**

`src/App.tsx:14`(`achievements: [`)부터 `src/App.tsx:175`(첫 번째 닫는 `],`, 즉 Vue→React 항목 다음 줄)까지를 아래 내용으로 교체한다. 인덱스 0(메모리 최적화)은 그대로 유지, 인덱스 1(Jotai)은 전면 재작성, 인덱스 2~5는 신규, 인덱스 6(Vue→React)은 기존 내용을 그대로 맨 뒤로 이동:

```typescript
  achievements: [
    {
      title: '대용량 실시간 데이터 처리 + 메모리 최적화',
      problem:
        '수천 대 장비의 실시간 데이터 처리 중 메모리 급증, 빈번한 GC로 브라우저 멈춤 발생',
      action:
        'V8 Heap 구조(Young/Old)를 분석하고, 불필요한 객체 생성을 억제. Typed Array 및 Object Pooling으로 할당 효율 개선',
      result:
        '메모리 누수 차단 및 GC 부하 감소. 실시간 스트리밍 환경에서도 프레임 드랍 없이 대시보드 시각화 안정화',
      metrics: {
        beforeLabel: 'JS Heap',
        beforeValue: '9.3MB → 382MB',
        afterLabel: 'JS Heap',
        afterValue: '7.8MB → 25.7MB',
      },
      screenshots: {
        beforeImg: `${import.meta.env.BASE_URL}images/memory-before.png`,
        afterImg: `${import.meta.env.BASE_URL}images/memory-after.png`,
        beforeAlt: 'V8 메모리 프로파일 - GC 톱니 패턴으로 382MB까지 증가',
        afterAlt: 'V8 메모리 프로파일 - 안정적으로 25.7MB 유지',
      },
      code: {
        title: '메모리 최적화 핵심 코드',
        beforeLabel: 'Before',
        afterLabel: 'After',
        beforeCaption: 'forEach + map + spread → 매 업데이트마다 전체 배열 복사, 230+ 필드 객체 통째로 복제',
        afterCaption: 'for loop + Map.get + Object.assign → 변경된 필드만 기존 객체에 직접 반영',
        beforeCode: `const handleUpdateLinkbookItem = (
  updatedItems: LinkbookType[]
) => {
  updatedItems.forEach((updated) => {
    linkbookRef.current = linkbookRef.current.map(
      (item) => {
        if (item.service_id === updated.service_id) {
          return {
            ...item,     // 230이상 필드 객체를 통째로 복사
            ...updated,
            sdn_service_details: {
              ...item.sdn_service_details,
              ...updated.sdn_service_details,
            },
          };
        }
        return item;
      }
    );
  });
};`,
        afterCode: `const handleUpdateLinkbookItem = (
  updatedItems: LinkbookType[]
) => {
  for (let i = 0; i < updatedItems.length; i++) {
    const updated = updatedItems[i];
    if (!updated.service_id) continue;

    const existing = linkbookMapRef.current
      .get(updated.service_id);

    if (existing) {
      const changed = getChangedFields(existing, updated);
      for (const key in changed) {
        const k = key as keyof LinkbookType;
        if (k === "sdn_service_details"
            && existing.sdn_service_details) {
          Object.assign(
            existing.sdn_service_details, changed[k]
          );
        } else {
          (existing as any)[k] = (changed as any)[k];
        }
      }
    } else {
      linkbookMapRef.current
        .set(updated.service_id, updated);
    }
  }
};`,
      },
    },
    {
      title: 'Recoil → Jotai 상태 관리 마이그레이션',
      problem:
        'Recoil의 실험적 상태 및 업데이트 불확실성, atom/selector 기반 보일러플레이트로 복잡도 증가',
      action:
        'Jotai 원자(atom) 기반 구조로 리팩토링. Recoil atom을 점진적으로 이관',
      result:
        'atom별 key 문자열 관리가 불필요해지고, selector 없이도 atomWithReset과 write-only atom 조합으로 파생·리셋 로직을 표현 — 상태 정의가 단순해지고 가독성·유지보수성 향상',
      code: {
        title: 'Store 정의: atom 5개 + selector → atomWithReset 기반 정의',
        beforeLabel: 'Recoil',
        afterLabel: 'Jotai',
        beforeCaption: 'atom마다 key 수동 관리, selector로 부분 업데이트 우회',
        afterCaption: 'key 관리 불필요, atomWithReset으로 리셋 로직까지 atom 레벨에서 처리',
        beforeCode: `// store/atom/work.ts
export const worksRegisterState =
  atom<WorkRegisterParams>({
    key: "worksRegisterState",
    default: { name: "", date: "...", ... },
  });

export const workRegisterTargetTabState =
  atom<string>({
    key: "workRegisterTargetTabState",
    default: "엑셀",
  });

export const rollbackState =
  atom<WorkHost[]>({
    key: "rollbackState",
    default: [],
  });

// store/selector/work.ts
export const worksRegisterDataSelector =
  selector({
    key: "worksRegisterDataSelector",
    get: ({ get }) => get(worksRegisterState),
    set: ({ set, get }, newValue) => {
      set(worksRegisterState, {
        ...get(worksRegisterState),
        ...newValue,
      });
    },
  });`,
        afterCode: `// store/atom/work.ts — key 관리 불필요
import { atomWithReset } from "jotai/utils";

export const worksRegisterAtom =
  atomWithReset<WorkRegisterParams>({
    name: "", date: "...", ...
  });

export const workRegisterTargetTabAtom =
  atomWithReset<string>("엑셀");

export const rollbackAtom =
  atomWithReset<WorkHost[]>([]);

// 파생 업데이트는 write-only atom으로 대체
export const updateWorksRegisterAtom = atom(
  null,
  (get, set, patch: Partial<WorkRegisterParams>) => {
    set(worksRegisterAtom, {
      ...get(worksRegisterAtom),
      ...patch,
    });
  }
);`,
      },
    },
    {
      title: 'OTDR 프로젝트 통합 — pnpm 모노레포 전환',
      problem:
        '이미 개발되어 있던 신규 프로젝트 OTDR이 HOLA에 편입. 같은 메뉴·라우팅, 인증 모듈, 토큰 갱신 로직, UI look & feel을 공유해야 했으나 HOLA(Next.js)와 OTDR(Vite+React)이 별도 코드베이스로 존재해 공통 로직 중복 발생',
      action:
        'pnpm workspace 기반 모노레포로 우선 통합한 뒤, 공통 모듈(네비게이션, 인증, 토큰 갱신, 디자인 시스템)을 점진적으로 추출해 공유 패키지화. 기존 git 커밋 이력을 보존하며 전환, Next.js와 React(Vite) 간 컴포넌트 구현 차이를 흡수하는 공유 컴포넌트 경계 설계',
      result:
        '네비게이션·인증 모듈 일원화로 한 곳만 수정해도 두 프로젝트에 동시 반영되는 구조 확보. 코드 중복 제거로 유지보수 비용 감소',
    },
    {
      title: '테스트 코드 도입 — 페이지별 통합 테스트 + CRUD 템플릿',
      problem:
        'SKT의 보안 정책 강화로 소스코드 취약점 검사가 잦아졌고, AG Grid·Next.js·React 등 핵심 패키지에서 취약점이 발견될 때마다 업데이트 후 전 페이지 수동 전수 테스트가 필요해 하루가 소요됨',
      action:
        'Jest + Testing Library로 페이지별 통합 테스트 구축. 생성·조회·수정·삭제(CRUD) 공통 테스트 템플릿을 만들고, 각 도메인 특성에 맞게 커스터마이징하는 방식으로 작성 효율화',
      result:
        '패키지 업데이트 시 검증 시간 1일 → 5분으로 단축',
    },
    {
      title: 'AI Aside 기반 배포 전 E2E 검증 자동화',
      problem:
        'QA 팀 없이 개발자가 QA를 병행하는 구조에서, Jira 릴리즈에 버그 수정·신규 기능이 한 번에 여러 건 묶여 배포되다 보니 수정 누락이나 운용자가 발견하는 버그(PN 이슈)가 잦았음',
      action:
        'AI 브라우저 에이전트 Aside(https://aside.com/)를 도입해 배포 전날 Jira 릴리즈 목록을 가져와 항목별로 직접 검증, 캡처와 수정 내용을 자동 기록하는 프로세스 구축',
      result:
        '운용자 발견 버그(PN 이슈) 월평균 10건 → 0~1건으로 감소, 배포 전 확인 절차 간소화',
    },
    {
      title: '레거시 툴체인 현대화 — npm → pnpm 전환',
      problem:
        'npm에서 pnpm으로 전환하는 과정에서, 정작 어떤 패키지가 무엇을 위해 실행하는지도 몰랐던 postinstall 스크립트들의 존재를 발견. 그중 콘솔에 불필요한 광고성 메시지를 출력하는 등 실질적으로 필요 없는 postinstall이 다수 포함되어 있었음',
      action:
        '전체 postinstall 스크립트를 점검해 불필요한 것(광고성 출력 등)은 제거하고, 실제로 필요한 것만 남기거나 추가. 같은 시기 Recoil → Jotai 전환도 함께 진행',
      result:
        '설치 과정 정리, 불필요한 스크립트 실행 제거로 install 효율 개선',
    },
    {
      title: 'Vue → React 기술 전환',
      action: '레거시 Vue 프로젝트를 React 기반 최신 스택으로 점진 마이그레이션',
      result: '기술 스택 통일, 코드 공유 가능, 유지보수 효율 증대',
    },
  ],
```

- [ ] **Step 4: `technicalDepth`에 신규 항목 반영**

`src/App.tsx`에서 (Step 3 반영 후) `technicalDepth: [` 배열을 찾아 아래 3개 항목을 기존 3개 뒤에 추가:

```typescript
  technicalDepth: [
    'WebSocket 실시간 로그 처리 로직을 추상화 계층으로 분리, 화면 간 재사용 구조 확보',
    'IE11부터 최신 브라우저까지 일관된 UI/UX를 위한 크로스 브라우징 대응',
    'Docker 이미지 빌드 및 Kubernetes 환경 배포 프로세스 수행',
    'CI/배포 경로 재구성 및 Next.js/Vite+React 간 공유 컴포넌트 구현 차이 대응 (모노레포 통합)',
    'Jest + Testing Library 기반 페이지별 통합 테스트와 CRUD 공통 템플릿 설계',
    'AI 브라우저 에이전트(Aside) 기반 Jira 릴리즈 검증 자동화 파이프라인 구축',
  ],
```

- [ ] **Step 5: `learningPoints`에 신규 항목 반영**

이어서 `learningPoints: [` 배열에 아래 3개 항목을 기존 4개 뒤에 추가:

```typescript
  learningPoints: [
    'V8 메모리 관리 메커니즘을 실무 최적화에 적용하며 저수준 최적화의 중요성 체감',
    '빅뱅 전환이 아닌 기능 단위 점진 전환의 효과 경험',
    '프론트엔드 개발자도 인프라(K8s, 배포)를 이해해야 하는 이유를 실감',
    '라이브러리 선택 시 커뮤니티 활성도, 유지보수성, 번들 사이즈, DX까지 고려하는 기준 확립',
    '모노레포 전환은 빅뱅이 아닌 공통 모듈 점진 추출로 리스크를 낮출 수 있음을 체감',
    'QA 인력 없이도 AI 에이전트를 동료처럼 활용해 품질 프로세스를 구축할 수 있음을 경험',
    '의존성 설치 과정에서 인지하지 못했던 postinstall 스크립트의 존재를 발견 — 패키지 도입 시 설치 스크립트까지 검토하는 습관 형성',
  ],
```

- [ ] **Step 6: 타입체크 + 빌드로 검증**

Run:
```bash
npm run build
```
Expected: `tsc -b`와 `vite build`가 에러 없이 통과. (achievements 배열의 각 객체가 `Achievement` 인터페이스를 만족하는지, 즉 `title`/`action`/`result`가 모든 항목에 존재하는지 타입체크로 확인됨)

- [ ] **Step 7: 앵커가 실제로 렌더링되는지 확인**

Run:
```bash
npm run dev
```
브라우저에서 `http://localhost:5173/portfolio/#hola2-achievement-2` (모노레포 항목), `#hola2-achievement-5` (레거시 툴체인 항목), `#hola2-achievement-6` (Vue→React, 마지막 항목)로 각각 접속해 해당 섹션으로 스크롤되는지 눈으로 확인. 완료 후 `Ctrl+C`로 서버 종료.

- [ ] **Step 8: Zustand 잔재가 없는지 확인**

Run:
```bash
grep -rn "Zustand" src/
```
Expected: 결과 없음 (모두 Jotai로 치환됨).

- [ ] **Step 9: 커밋**

```bash
git add src/App.tsx
git commit -m "feat: HOLA 2.0 포트폴리오에 모노레포/테스트/AI Aside/레거시 전환 경험 추가

Recoil→Zustand로 잘못 기재됐던 부분을 Recoil→Jotai로 정정

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 2: 노션 포트폴리오 페이지 갱신

**Files:**
- 없음 (노션 페이지, page_id `311f57e3-1674-8111-b80b-eb54893a5efc`)

**Interfaces:**
- Consumes: Task 1에서 확정한 achievement 순서와 문구 (동일 텍스트를 노션 포맷으로 재사용)
- Produces: 없음 (Task 3과 독립적, 노션 이력서는 웹사이트 앵커만 참조하고 노션 포트폴리오 페이지 자체는 참조하지 않음)

- [ ] **Step 1: 현재 페이지 상태 확인**

`mcp__claude_ai_Notion__notion-fetch`로 `id: "311f57e3-1674-8111-b80b-eb54893a5efc"`를 조회해 "Recoil → Zustand" 문구와 achievement 2개(대용량 처리, 상태관리)만 있고 OTDR/테스트/AI Aside/postinstall 관련 내용이 없음을 확인.

- [ ] **Step 2: achievement 2번(Recoil→Zustand) 정정**

`mcp__claude_ai_Notion__notion-update-page`의 `update_content` 커맨드로 아래 `old_str` → `new_str` 치환 (`replace_all_matches: false`):

old_str 대상: 노션 페이지의 "#### 2. Recoil → Zustand 상태 관리 마이그레이션" 섹션 전체 — 제목부터 다음 `---` 구분선 直前까지 (Problem/Action/Result, "코드/측정 스냅샷" 제목, `<columns>` 블록 2개(Store 정의, 컴포넌트 사용) 전부 포함)

new_str: 아래 내용으로 전체 교체. 번들 사이즈 수치(96%, 79KB→2.9KB)와 "컴포넌트 사용" 비교 블록은 삭제하고, Store 정의 코드 비교 1개만 남긴다 (Task 1의 Jotai `beforeCode`/`afterCode`와 동일 코드 사용):

```markdown
#### 2. Recoil → Jotai 상태 관리 마이그레이션
- **Problem**: Recoil의 실험적 상태 및 업데이트 불확실성, atom/selector 기반 보일러플레이트로 복잡도 증가
- **Action**: Jotai 원자(atom) 기반 구조로 리팩토링. Recoil atom을 점진적으로 이관
- **Result**: atom별 key 문자열 관리가 불필요해지고, selector 없이도 atomWithReset과 write-only atom 조합으로 파생·리셋 로직을 표현 — 상태 정의가 단순해지고 가독성·유지보수성 향상
### 코드/측정 스냅샷
**Store 정의: atom 5개 + selector 1개 → atomWithReset 기반 정의**
<columns>
	<column>
		<callout icon="⚠️" color="red_bg">
			**Before (Recoil)** — atom마다 key 수동 관리
		</callout>
		```typescript
// store/atom/work.ts
export const worksRegisterState =
  atom<WorkRegisterParams>({
    key: "worksRegisterState",
    default: { name: "", date: "...", ... },
  });

export const workRegisterTargetTabState =
  atom<string>({
    key: "workRegisterTargetTabState",
    default: "엑셀",
  });

export const rollbackState =
  atom<WorkHost[]>({
    key: "rollbackState",
    default: [],
  });

// store/selector/work.ts
export const worksRegisterDataSelector =
  selector({
    key: "worksRegisterDataSelector",
    get: ({ get }) => get(worksRegisterState),
    set: ({ set, get }, newValue) => {
      set(worksRegisterState, {
        ...get(worksRegisterState),
        ...newValue,
      });
    },
  });
		```
	</column>
	<column>
		<callout icon="✅" color="green_bg">
			**After (Jotai)** — key 관리 불필요, atomWithReset으로 리셋까지 처리
		</callout>
		```typescript
// store/atom/work.ts — key 관리 불필요
import { atomWithReset } from "jotai/utils";

export const worksRegisterAtom =
  atomWithReset<WorkRegisterParams>({
    name: "", date: "...", ...
  });

export const workRegisterTargetTabAtom =
  atomWithReset<string>("엑셀");

export const rollbackAtom =
  atomWithReset<WorkHost[]>([]);

// 파생 업데이트는 write-only atom으로 대체
export const updateWorksRegisterAtom = atom(
  null,
  (get, set, patch: Partial<WorkRegisterParams>) => {
    set(worksRegisterAtom, {
      ...get(worksRegisterAtom),
      ...patch,
    });
  }
);
		```
	</column>
</columns>
```

- [ ] **Step 3: Vue→React 섹션을 최하단으로 이동, 신규 4개 achievement 삽입**

`replace_content` 또는 `update_content`로 HOLA 2.0 섹션 내 achievement 순서를 다음과 같이 재배열:
1. 대용량 실시간 데이터 처리 (변경 없음, 그대로 유지)
2. Recoil → Jotai (Step 2에서 정정 완료)
3. OTDR 프로젝트 통합 — pnpm 모노레포 전환 (신규)
4. 테스트 코드 도입 — 페이지별 통합 테스트 + CRUD 템플릿 (신규)
5. AI Aside 기반 배포 전 E2E 검증 자동화 (신규)
6. 레거시 툴체인 현대화 — npm → pnpm 전환 (신규)
7. Vue → React 기술 전환 (기존 "#### 3." 항목을 그대로 맨 뒤로 이동, 번호만 "#### 7."로 변경)

신규 4개 achievement는 아래 문구를 그대로 삽입한다 (`metrics`/코드 스냅샷/이미지 컬럼 없음):

```markdown
#### 3. OTDR 프로젝트 통합 — pnpm 모노레포 전환
- **Problem**: 이미 개발되어 있던 신규 프로젝트 OTDR이 HOLA에 편입. 같은 메뉴·라우팅, 인증 모듈, 토큰 갱신 로직, UI look & feel을 공유해야 했으나 HOLA(Next.js)와 OTDR(Vite+React)이 별도 코드베이스로 존재해 공통 로직 중복 발생
- **Action**: pnpm workspace 기반 모노레포로 우선 통합한 뒤, 공통 모듈(네비게이션, 인증, 토큰 갱신, 디자인 시스템)을 점진적으로 추출해 공유 패키지화. 기존 git 커밋 이력을 보존하며 전환, Next.js와 React(Vite) 간 컴포넌트 구현 차이를 흡수하는 공유 컴포넌트 경계 설계
- **Result**: 네비게이션·인증 모듈 일원화로 한 곳만 수정해도 두 프로젝트에 동시 반영되는 구조 확보. 코드 중복 제거로 유지보수 비용 감소
### 기술적 깊이
- CI/배포 경로 재구성 및 Next.js/Vite+React 간 공유 컴포넌트 구현 차이 대응
---
#### 4. 테스트 코드 도입 — 페이지별 통합 테스트 + CRUD 템플릿
- **Problem**: SKT의 보안 정책 강화로 소스코드 취약점 검사가 잦아졌고, AG Grid·Next.js·React 등 핵심 패키지에서 취약점이 발견될 때마다 업데이트 후 전 페이지 수동 전수 테스트가 필요해 하루가 소요됨
- **Action**: Jest + Testing Library로 페이지별 통합 테스트 구축. 생성·조회·수정·삭제(CRUD) 공통 테스트 템플릿을 만들고, 각 도메인 특성에 맞게 커스터마이징하는 방식으로 작성 효율화
- **Result**: 패키지 업데이트 시 검증 시간 1일 → 5분으로 단축
### 기술적 깊이
- Jest + Testing Library 기반 페이지별 통합 테스트와 CRUD 공통 템플릿 설계
---
#### 5. AI Aside 기반 배포 전 E2E 검증 자동화
- **Problem**: QA 팀 없이 개발자가 QA를 병행하는 구조에서, Jira 릴리즈에 버그 수정·신규 기능이 한 번에 여러 건 묶여 배포되다 보니 수정 누락이나 운용자가 발견하는 버그(PN 이슈)가 잦았음
- **Action**: AI 브라우저 에이전트 [Aside](https://aside.com/)를 도입해 배포 전날 Jira 릴리즈 목록을 가져와 항목별로 직접 검증, 캡처와 수정 내용을 자동 기록하는 프로세스 구축
- **Result**: 운용자 발견 버그(PN 이슈) 월평균 10건 → 0~1건으로 감소, 배포 전 확인 절차 간소화
### 기술적 깊이
- AI 브라우저 에이전트(Aside) 기반 Jira 릴리즈 검증 자동화 파이프라인 구축
---
#### 6. 레거시 툴체인 현대화 — npm → pnpm 전환
- **Problem**: npm에서 pnpm으로 전환하는 과정에서, 정작 어떤 패키지가 무엇을 위해 실행하는지도 몰랐던 postinstall 스크립트들의 존재를 발견. 그중 콘솔에 불필요한 광고성 메시지를 출력하는 등 실질적으로 필요 없는 postinstall이 다수 포함되어 있었음
- **Action**: 전체 postinstall 스크립트를 점검해 불필요한 것(광고성 출력 등)은 제거하고, 실제로 필요한 것만 남기거나 추가
- **Result**: 설치 과정 정리, 불필요한 스크립트 실행 제거로 install 효율 개선
- **러닝 포인트**: 의존성 설치 과정에서 내가 인지하지 못한 채 실행되고 있던 postinstall의 존재를 인지 — 패키지 도입 시 postinstall 스크립트까지 검토해야 한다는 습관 형성. (같은 시기 Recoil → Jotai 전환도 함께 진행 — 상세는 위 상태관리 마이그레이션 항목 참고)
---
```

각 신규 항목 사이에 노션 페이지의 기존 구분선 스타일(`---`)을 그대로 유지한다. 이어서 기존 "#### 3. Vue → React 기술 전환" 블록(제목, action, result)을 그대로 이 뒤로 옮기고 번호만 "#### 7."로 바꾼다.

- [ ] **Step 4: 결과 검증**

`mcp__claude_ai_Notion__notion-fetch`로 같은 페이지를 다시 조회해:
- `Zustand` 문자열이 더 이상 없는지
- achievement가 "대용량 처리 → Jotai → OTDR → 테스트 → AI Aside → 레거시 툴체인 → Vue→React" 순서로 7개 존재하는지
- "96%" 또는 "79KB" 수치가 남아있지 않은지
확인한다.

- [ ] **Step 5: 완료 보고**

노션 페이지는 버전 관리 대상이 아니므로 git 커밋 없음. 사용자에게 "포트폴리오 페이지 갱신 완료" 보고.

---

## Task 3: 노션 이력서 페이지 갱신 (불릿 + 딥링크)

**Files:**
- 없음 (노션 페이지, page_id `311f57e3-1674-813c-b56b-e389efcafd3c`)

**Interfaces:**
- Consumes: Task 1에서 확정한 `hola2-achievement-{index}` 인덱스 (0~6), 프로젝트 카드 앵커(`project-hola2`/`project-cloudxpm`/`project-watchman`/`project-gsinstech`, `src/App.tsx:491-510`에 이미 존재, 변경 없음)
- Produces: 없음 (최종 사용자 대면 산출물)

- [ ] **Step 1: 현재 페이지 상태 확인**

`mcp__claude_ai_Notion__notion-fetch`로 `id: "311f57e3-1674-813c-b56b-e389efcafd3c"`를 조회해 HOLA 2.0의 "주요 성과" 항목이 아직 1줄 요약인지 확인.

- [ ] **Step 2: HOLA 2.0 "주요 성과" 1줄을 6개 불릿 + 딥링크로 교체**

`mcp__claude_ai_Notion__notion-update-page`의 `update_content` 커맨드로, 기존 HOLA 2.0 섹션의 `- **주요 성과**: V8 엔진 메모리 구조 최적화로...` 한 줄을 아래로 교체:

```markdown
- **주요 성과**:
  - **대용량 실시간 데이터 처리 + 메모리 최적화**: V8 힙 구조 분석 및 불필요한 객체 생성 억제로 수천 대 장비의 실시간 데이터 처리 시 메모리 누수 차단. JS 힙 사용량 382MB → 25.7MB로 감소, GC 부하 완화로 프레임 드랍 없는 대시보드 안정화. [자세히 보기](https://leeseungjae00.github.io/portfolio/#hola2-achievement-0)
  - **OTDR 프로젝트 통합 — pnpm 모노레포 전환**: Next.js(HOLA)와 Vite+React(OTDR) 별도 프로젝트를 pnpm 워크스페이스 모노레포로 통합, 네비게이션·인증·토큰 갱신·UI를 공통 모듈화. 기존 git 이력을 보존하며 점진 전환, 한 번의 수정이 양쪽에 반영되는 구조 확보. [자세히 보기](https://leeseungjae00.github.io/portfolio/#hola2-achievement-2)
  - **테스트 코드 도입 — 페이지별 통합 테스트 + CRUD 템플릿**: 보안 취약점 대응으로 잦아진 AG Grid/Next.js/React 등 주요 패키지 업데이트에 대응해 Jest/Testing Library 기반 페이지별 통합 테스트 구축, 생성·조회·수정·삭제 공통 템플릿화. 패키지 업데이트 시 검증 시간 1일 → 5분으로 단축. [자세히 보기](https://leeseungjae00.github.io/portfolio/#hola2-achievement-3)
  - **AI Aside 기반 배포 전 E2E 검증 자동화**: QA 인력 부재 환경에서 AI 브라우저 에이전트 Aside를 도입해 배포 전날 Jira 릴리즈 목록 기반 자동 검증 체계 구축. 운용자 발견 버그(PN 이슈) 월평균 10건 → 0~1건으로 감소. [자세히 보기](https://leeseungjae00.github.io/portfolio/#hola2-achievement-4)
  - **레거시 스택 현대화 — npm → pnpm, Recoil → Jotai**: npm에서 pnpm으로 전환하며 불필요한 postinstall 스크립트 제거, Recoil을 Jotai로 마이그레이션. 빌드·설치 효율 개선 및 상태 관리 코드 단순화. [자세히 보기](https://leeseungjae00.github.io/portfolio/#hola2-achievement-5)
  - **Vue → React 기술 전환**: 레거시 Vue 프로젝트를 React 기반 최신 스택으로 점진 마이그레이션. 기술 스택 통일로 코드 공유 및 유지보수 효율 확보. [자세히 보기](https://leeseungjae00.github.io/portfolio/#hola2-achievement-6)
```

- [ ] **Step 3: 프로젝트 제목마다 "자세히 보기" 링크 추가**

이력서의 각 프로젝트 제목 줄(`#### 1. HOLA 2.0 (SI)`, `#### 2. CloudXPM (자사 서비스)`, `#### 3. WatchMAN+ (SI)`, 그리고 GSInstech의 `#### 중계기 상태 대시보드`)에 아래처럼 링크를 덧붙인다. 예시(HOLA 2.0):

```markdown
#### 1. HOLA 2.0 (SI) — [자세히 보기](https://leeseungjae00.github.io/portfolio/#project-hola2)
```

나머지 3개도 동일한 패턴으로:
- CloudXPM → `[자세히 보기](https://leeseungjae00.github.io/portfolio/#project-cloudxpm)`
- WatchMAN+ → `[자세히 보기](https://leeseungjae00.github.io/portfolio/#project-watchman)`
- 중계기 상태 대시보드 → `[자세히 보기](https://leeseungjae00.github.io/portfolio/#project-gsinstech)`

- [ ] **Step 4: 결과 검증**

`mcp__claude_ai_Notion__notion-fetch`로 같은 페이지를 다시 조회해:
- HOLA 2.0에 불릿 6개와 각 불릿 끝 `자세히 보기` 링크가 존재하는지
- 4개 프로젝트 제목 모두에 `자세히 보기` 링크가 달려 있는지
- 각 링크의 앵커(`#hola2-achievement-0`~`6`, `#project-*`)가 Task 1에서 확정한 인덱스와 정확히 일치하는지 (오타나 순서 밀림이 없는지 한 글자씩 대조)
확인한다.

- [ ] **Step 5: 완료 보고**

노션 페이지는 버전 관리 대상이 아니므로 git 커밋 없음. 사용자에게 "이력서 페이지 갱신 완료" 보고와 함께 최종 노션 페이지 URL 안내.

---

## Self-Review Checklist (구현 시 참고)

- [ ] 스펙의 "정정 사항"(Zustand→Jotai)이 Task 1(웹사이트)과 Task 2(노션 포트폴리오) 모두에 반영되는가 — 반영됨
- [ ] 스펙의 HOLA 2.0 신규 경험 4가지가 이력서(Task 3)와 포트폴리오(Task 1, 2) 양쪽 모두에 존재하는가 — 반영됨
- [ ] 스펙의 "이력서 딥링크" 절이 Task 3에 그대로 구현되는가 — 반영됨, 인덱스는 Task 1의 Produces 블록과 정확히 일치
- [ ] 허수 수치 생성 금지 원칙이 지켜지는가 — Jotai 항목에서 검증 안 된 번들 사이즈 수치를 삭제했으므로 준수
