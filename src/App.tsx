import Header from './components/Header'
import ProjectCard, { type ProjectData } from './components/ProjectCard'
import Footer from './components/Footer'

/* ─── Project Data ─── */

const hola2: ProjectData = {
  _idPrefix: 'hola2',
  title: 'HOLA 2.0',
  subtitle: '이동통신사 운용 통신 장비 자동화 및 관리 플랫폼 (SI)',
  tech: ['Next.js', 'TypeScript', 'React Query', 'Zustand', 'WebSocket', 'Kubernetes', 'Docker', 'AG Grid'],
  period: '2024.03 ~ 현재',
  contribution: '프론트엔드 100% (단독)',
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
      title: 'Recoil → Zustand 상태 관리 마이그레이션',
      problem:
        'Recoil의 실험적 상태 및 업데이트 불확실성, atom/selector 기반 보일러플레이트로 복잡도 증가',
      action: 'Zustand 스토어 기반 구조로 리팩토링. Recoil atom을 점진 이관',
      result:
        '번들 사이즈 96% 감소 (79KB → 2.9KB), 상태 로직 단순화, 가독성 및 유지보수성 향상',
      metrics: {
        beforeLabel: '번들 사이즈',
        beforeValue: '79KB',
        afterLabel: '번들 사이즈',
        afterValue: '2.9KB',
      },
      code: {
        title: 'Store 정의: atom 5개 + selector → store 1개',
        beforeLabel: 'Recoil',
        afterLabel: 'Zustand',
        beforeCaption: 'atom마다 key 수동 관리, selector로 부분 업데이트 우회',
        afterCaption: 'key 관리 불필요, 1개 파일에 상태+액션 통합',
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
        afterCode: `// stores/useWorkStore.ts
export const useWorkStore =
  create<WorkState>((set) => ({
    register: {
      name: "", date: "...", ...
    },
    targetTab: "엑셀",
    rollbackHosts: [],
    workLog: {},

    updateRegister: (data) =>
      set((s) => ({
        register: { ...s.register, ...data }
      })),

    setTargetTab: (tab) =>
      set({ targetTab: tab }),

    reset: () => set({
      register: initialRegister,
      targetTab: "엑셀",
      rollbackHosts: [],
      workLog: {},
    }),
  }));`,
      },
    },
    {
      title: 'Vue → React 기술 전환',
      action: '레거시 Vue 프로젝트를 React 기반 최신 스택으로 점진 마이그레이션',
      result: '기술 스택 통일, 코드 공유 가능, 유지보수 효율 증대',
    },
  ],
  technicalDepth: [
    'WebSocket 실시간 로그 처리 로직을 추상화 계층으로 분리, 화면 간 재사용 구조 확보',
    'IE11부터 최신 브라우저까지 일관된 UI/UX를 위한 크로스 브라우징 대응',
    'Docker 이미지 빌드 및 Kubernetes 환경 배포 프로세스 수행',
  ],
  learningPoints: [
    'V8 메모리 관리 메커니즘을 실무 최적화에 적용하며 저수준 최적화의 중요성 체감',
    '빅뱅 전환이 아닌 기능 단위 점진 전환의 효과 경험',
    '프론트엔드 개발자도 인프라(K8s, 배포)를 이해해야 하는 이유를 실감',
    '라이브러리 선택 시 커뮤니티 활성도, 유지보수성, 번들 사이즈, DX까지 고려하는 기준 확립',
  ],
}

const cloudxpm: ProjectData = {
  _idPrefix: 'cloudxpm',
  title: 'CloudXPM',
  subtitle: '모바일 원격 제어 및 No-Code 테스트 자동화 플랫폼 (자사 서비스)',
  tech: [
    'Next.js', 'TypeScript', 'Recoil', 'React Query',
    'Jest', 'Testing Library', 'SSE', 'Express.js', 'Styled-components', 'MUI',
  ],
  period: '2023.03 ~ 2024.03',
  contribution: '프론트엔드 70% (리드, 협업 1명)',
  achievements: [
    {
      title: '대규모 데이터 렌더링 최적화',
      problem:
        '시나리오 STEP 증가로 중복 UI/정보 과다 → 렌더링 30초+ 및 브라우저 응답 없음 발생',
      action:
        '시나리오 STEP의 모든 데이터를 보여주는 UI구조 변경, React Profiler로 병목 분석, 불필요한 리렌더링 차단',
      result:
        '동일 데이터 기준(시나리오 STEP 1000개) 렌더링 시간 약 9.5배 단축, 사용자 체감 성능 개선',
      metrics: {
        beforeLabel: 'Render',
        beforeValue: '46.6ms',
        afterLabel: 'Render',
        afterValue: '4.9ms',
      },
      screenshots: {
        beforeImg: `${import.meta.env.BASE_URL}images/profiler-before.png`,
        afterImg: `${import.meta.env.BASE_URL}images/profiler-after.png`,
        beforeAlt: 'React Profiler - Render 46.6ms, Passive effects 54.3ms',
        afterAlt: 'React Profiler - Render 4.9ms, Passive effects 0.2ms',
      },
    },
    {
      title: '인터랙션 응답 시간 개선',
      problem: '복잡한 컴포넌트 구조로 클릭/입력 지연 발생',
      action:
        'Recoil과 React Query로 서버/클라이언트 상태를 분리하고 메모이제이션 전략 적용',
      result: '시나리오 1000개 기준 인터랙션 응답 시간 평균 0.5초 단축',
    },
  ],
  technicalDepth: [
    'SSE 도입으로 명령어 실행 상태를 실시간 대시보드에 반영',
    'Jest + Testing Library로 오류 민감 영역 유닛 테스트 환경 구축',
    'Express.js + node-cron 기반 데몬 서버 2종 구축 (자동화 서버 브릿지, 디바이스 상태 감지)',
    '구조 설계, 개발환경 구축, 배포까지 리드',
    'next-i18next 기반 다국어(한/영) 대응',
  ],
  learningPoints: [
    '데이터 기반(Profiler) 병목 분석 방법론 습득',
    '상태 관리 도구 선택이 렌더링 성능에 미치는 영향을 정량 비교',
    '리드로서 리뷰/아키텍처/일정 관리 경험을 통해 팀 리딩 역량 성장',
    'SSE/WebSocket/Polling 트레이드오프를 요구사항에 맞춰 판단',
  ],
}

const watchman: ProjectData = {
  _idPrefix: 'watchman',
  title: 'WatchMAN+',
  subtitle: 'API 요청 테스트 및 모바일/웹 시나리오 모니터링 플랫폼 (SI)',
  tech: ['React', 'TypeScript', 'Redux', 'Redux-Saga', 'Styled-components', 'MUI', 'Docker', 'Nginx'],
  period: '2022.01 ~ 2023.02',
  contribution: '프론트엔드 100% (단독)',
  achievements: [
    {
      title: 'JavaScript → TypeScript 마이그레이션',
      problem: '타입 관련 런타임 에러로 디버깅 비용 증가',
      action: '단계적 전환과 엄격한 타입 정의 적용',
      result: '타입 안정성 확보, 가독성 향상, 디버깅 생산성 개선',
    },
    {
      title: '코드 구조 개선 및 추상화',
      problem: '비즈니스 로직과 UI 결합으로 유지보수 난이도 증가',
      action: '로직/UI 분리, 추상화 레벨 통일',
      result: '코드 가독성 향상, 인수인계 용이한 구조 확보',
    },
  ],
  technicalDepth: [
    '조직/개인 권한 기반 라우팅 및 UI 분기 처리',
    'QA 배포 → 이슈 관리 → 프로덕션 운영까지 서비스 라이프사이클 경험',
    'Redux-Saga로 복잡한 비동기 흐름 관리',
  ],
  learningPoints: [
    'TS 마이그레이션은 설계 재정비의 기회임을 체감',
    '"다음 개발자가 이해 가능한가"를 기준으로 코드 작성 습관 형성',
    'SI 프로젝트에서 문서화/컨벤션의 중요성 학습',
  ],
}

const gsInstech: ProjectData = {
  title: '중계기 상태 대시보드',
  subtitle: '중계기 실시간 상태 모니터링 대시보드 (GSInstech)',
  tech: ['React', 'JavaScript', 'Redux', 'TypeScript', 'Chart.js', 'Bootstrap'],
  period: '2020.07 ~ 2021.08',
  contribution: '프론트엔드 100% (단독)',
  achievements: [
    {
      title: '레거시 웹 → React SPA 마이그레이션',
      problem: '번들링 없는 HTML/CSS/JS로 유지보수 어려움, 기능 추가 시 사이드이펙트 빈발',
      action: 'React SPA로 재설계, Code Splitting 및 번들 최적화 적용',
      result: '모듈화로 유지보수성 향상, payload 감소',
    },
  ],
  technicalDepth: [
    '제한 리소스(임베디드) 환경에서 리소스 사용 최소화',
    'Chart.js 기반 실시간 상태 데이터 시각화',
    '프론트엔드 기술 환경을 기초부터 구성',
  ],
  learningPoints: [
    '제약 환경에서는 "무엇을 추가할까"보다 "무엇을 빼야 할까"를 우선 고민',
    '번들링의 의미/효과를 레거시와 비교 체감',
    '커리어 초기에 JavaScript 기반 체력 강화',
  ],
}

const sideProjects = [
  {
    title: '모두의 일기',
    description: '누구나 그림 일기 형식으로 일상을 기록할 수 있는 플랫폼',
    tech: ['Next.js', 'TypeScript', 'React Query', 'TailwindCSS', 'Canvas', 'Vercel'],
    highlights: [
      'Next.js SSR 기반 SEO 및 초기 로딩 최적화',
      'Canvas API 기반 그림일기 에디터 구현 (터치/마우스 대응)',
      'OAuth 인증 및 Vercel CI/CD 배포',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/LeeSeungjae00/modoo-diary' },
    ],
  },
  {
    title: '코인 자동매매',
    description: '사용자 정의 매수/매도 전략에 따른 암호화폐 자동 거래 시스템',
    tech: ['Node.js', 'Express.js', 'TypeScript', 'React', 'Prisma', 'MySQL', 'node-cron'],
    highlights: [
      'Open API 기반 실시간 데이터 수집 및 자동 트레이딩 봇 개발',
      '과거 데이터 기반 백테스팅 시뮬레이션 기능 구현',
      'Express.js + Prisma + MySQL로 백엔드/DB 구축',
      '실현 손익 +20%',
    ],
    links: [
      { label: 'Frontend', url: 'https://github.com/LeeSeungjae00/coin-front-end' },
      { label: 'Backend', url: 'https://github.com/LeeSeungjae00/coin-auto.v2' },
    ],
  },
]

const skills = {
  strengths: [
    { label: '대용량/실시간 데이터 처리', target: 'hola2-achievement-0' },
    { label: '성능 최적화 (메모리, 렌더링)', target: 'cloudxpm-achievement-0' },
    { label: '레거시 마이그레이션 (Vue→React, JS→TS)', target: 'watchman-achievement-0' },
    { label: '개발환경/배포 (Docker, K8s)', target: 'hola2-depth' },
  ],
  stack: [
    { category: 'Frontend', items: ['Next.js', 'TypeScript', 'React', 'React Query', 'Zustand', 'Recoil', 'Redux'] },
    { category: 'Styling', items: ['Styled-components', 'TailwindCSS', 'MUI'] },
    { category: 'Testing', items: ['Jest', 'Testing Library', 'Appium'] },
    { category: 'Infra', items: ['Docker', 'Kubernetes', 'Nginx', 'Express.js'] },
  ],
}

/* ─── App ─── */

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section
        id="about"
        className="pt-32 pb-20 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-primary-600 font-semibold text-sm mb-3 tracking-wide">
            Frontend Developer
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            이승재
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mb-8">
            성능 최적화를 중요시하며, 자기설명적인 코드를 지향하는 개발자입니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/LeeSeungjae00"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="mailto:seungjae266789@naver.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
              이메일
            </a>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8">
            <div className="grid md:grid-cols-[1fr_1px_1.2fr] gap-8">
              {/* Left - Strengths */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">주요 역량</h3>
                <div className="space-y-2">
                  {skills.strengths.map((s) => (
                    <div
                      key={s.label}
                      onClick={() => {
                        const el = document.getElementById(s.target)
                        if (!el) return
                        // 기술적 깊이 섹션이면 자동으로 펼치기
                        if (s.target.endsWith('-depth')) {
                          const btn = el.querySelector('button')
                          const list = el.querySelector('ul')
                          if (btn && !list) btn.click()
                        }
                        setTimeout(() => {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          el.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease, background 0.4s ease'
                          el.style.transform = 'scale(1.02)'
                          el.style.boxShadow = '0 0 0 2px rgba(147,197,253,0.5), 0 4px 20px rgba(59,130,246,0.1)'
                          el.style.background = '#eff6ff'
                          setTimeout(() => {
                            el.style.transform = 'scale(1)'
                            el.style.boxShadow = 'none'
                            el.style.background = ''
                          }, 2000)
                        }, 100)
                      }}
                      className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-2.5 cursor-pointer hover:border-primary-300 hover:bg-primary-50/50 transition-all group"
                    >
                      <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="text-sm font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{s.label}</span>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-auto text-slate-300 group-hover:text-primary-500 transition-colors shrink-0">
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block bg-slate-200" />

              {/* Right - Tech Stack */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">기술 스택</h3>
                <div className="space-y-3">
                  {skills.stack.map((group) => (
                    <div key={group.category} className="flex items-start gap-3">
                      <span className="text-[11px] font-bold text-slate-400 mt-1 w-14 shrink-0 text-right">
                        {group.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-white text-slate-700 rounded-md border border-slate-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section id="experience" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-10">Work Experience</h2>

          {/* Atlas Networks */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                AT
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Atlas Networks</h3>
                <p className="text-xs text-slate-400">프론트엔드 개발자 | 2021.12 ~ 현재</p>
              </div>
            </div>
            <div className="space-y-6 ml-0 md:ml-[52px]">
              <ProjectCard project={hola2} id="project-hola2" />
              <ProjectCard project={cloudxpm} id="project-cloudxpm" />
              <ProjectCard project={watchman} id="project-watchman" />
            </div>
          </div>

          {/* GSInstech */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                GS
              </div>
              <div>
                <h3 className="font-bold text-slate-900">GSInstech</h3>
                <p className="text-xs text-slate-400">프론트엔드 개발자 | 2018.12 ~ 2021.08</p>
                <p className="text-xs text-slate-400 italic">입사 초기(2018.12 ~ 2020.07)에는 웹 퍼블리싱 및 임베디드 시스템 개발 담당</p>
              </div>
            </div>
            <div className="ml-0 md:ml-[52px]">
              <ProjectCard project={gsInstech} id="project-gsinstech" />
            </div>
          </div>
        </div>
      </section>

      {/* Side Projects */}
      <section id="side-projects" className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-10">Side Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sideProjects.map((project) => (
              <div
                key={project.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-1">{project.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <ul className="space-y-1.5 mb-5">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="shrink-0 w-1 h-1 bg-slate-400 rounded-full mt-2" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-700 transition-colors"
                    >
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-10">Education & Qualification</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs font-semibold text-primary-600 mb-1">학력</div>
              <div className="font-bold text-slate-900 text-sm">한국공학대학교</div>
              <div className="text-xs text-slate-500 mt-0.5">컴퓨터전자공학과 학사 (2019 ~ 2023)</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs font-semibold text-primary-600 mb-1">자격증</div>
              <div className="font-bold text-slate-900 text-sm">정보처리기사</div>
              <div className="text-xs text-slate-500 mt-0.5">2021.11 취득</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs font-semibold text-primary-600 mb-1">자격증</div>
              <div className="font-bold text-slate-900 text-sm">정보통신산업기사</div>
              <div className="text-xs text-slate-500 mt-0.5">2020.08 취득</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs font-semibold text-emerald-600 mb-1">병역</div>
              <div className="font-bold text-slate-900 text-sm">산업기능요원</div>
              <div className="text-xs text-slate-500 mt-0.5">현역 복무 완료</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
