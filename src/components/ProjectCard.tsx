import { useState } from 'react'
import CodeCompare from './CodeCompare'
import ImageLightbox from './ImageLightbox'

interface Metric {
  beforeLabel: string
  beforeValue: string
  afterLabel: string
  afterValue: string
}

interface CodeExample {
  title: string
  beforeLabel: string
  afterLabel: string
  beforeCode: string
  afterCode: string
  beforeCaption?: string
  afterCaption?: string
}

interface ScreenshotPair {
  beforeImg: string
  afterImg: string
  beforeAlt: string
  afterAlt: string
}

interface Achievement {
  title: string
  problem?: string
  action: string
  result: string
  metrics?: Metric
  screenshots?: ScreenshotPair
  code?: CodeExample
}

export interface ProjectData {
  title: string
  subtitle: string
  tech: string[]
  period: string
  contribution: string
  achievements: Achievement[]
  technicalDepth: string[]
  learningPoints: string[]
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Before</div>
        <div className="text-xs font-semibold text-amber-800">{metric.beforeLabel}</div>
        <div className="text-lg font-bold text-amber-900 mt-0.5">{metric.beforeValue}</div>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">After</div>
        <div className="text-xs font-semibold text-emerald-800">{metric.afterLabel}</div>
        <div className="text-lg font-bold text-emerald-900 mt-0.5">{metric.afterValue}</div>
      </div>
    </div>
  )
}

function AchievementSection({ achievement, index }: { achievement: Achievement; index: number }) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-sm font-bold text-slate-800 flex items-start gap-2 mb-3">
        <span className="shrink-0 w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-[11px] font-bold mt-px">
          {index + 1}
        </span>
        {achievement.title}
      </h4>

      <div className="ml-7 space-y-2">
        {achievement.problem && (
          <div className="flex items-start gap-2">
            <span className="shrink-0 text-[11px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded mt-px">Problem</span>
            <p className="text-sm text-slate-600 leading-relaxed">{achievement.problem}</p>
          </div>
        )}
        <div className="flex items-start gap-2">
          <span className="shrink-0 text-[11px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded mt-px">Action</span>
          <p className="text-sm text-slate-600 leading-relaxed">{achievement.action}</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="shrink-0 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-px">Result</span>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">{achievement.result}</p>
        </div>
      </div>

      {achievement.metrics && (
        <div className="ml-7">
          <MetricCard metric={achievement.metrics} />
        </div>
      )}

      {achievement.screenshots && (
        <div className="ml-7 grid grid-cols-2 gap-3 mt-3">
          <div>
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">Before</div>
            <ImageLightbox
              src={achievement.screenshots.beforeImg}
              alt={achievement.screenshots.beforeAlt}
              className="w-full rounded-lg border border-slate-700"
            />
          </div>
          <div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5">After</div>
            <ImageLightbox
              src={achievement.screenshots.afterImg}
              alt={achievement.screenshots.afterAlt}
              className="w-full rounded-lg border border-slate-700"
            />
          </div>
        </div>
      )}

      {achievement.code && (
        <div className="ml-7">
          <CodeCompare
            title={achievement.code.title}
            beforeLabel={achievement.code.beforeLabel}
            afterLabel={achievement.code.afterLabel}
            beforeCode={achievement.code.beforeCode}
            afterCode={achievement.code.afterCode}
            beforeCaption={achievement.code.beforeCaption}
            afterCaption={achievement.code.afterCaption}
          />
        </div>
      )}
    </div>
  )
}

export default function ProjectCard({ project }: { project: ProjectData }) {
  const [showDepth, setShowDepth] = useState(false)
  const [showLearning, setShowLearning] = useState(false)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{project.title}</h3>
            <p className="text-sm text-slate-500">{project.subtitle}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {project.period}
            </span>
            <span className="text-xs text-slate-400">
              기여도: <strong className="text-slate-600">{project.contribution}</strong>
            </span>
          </div>
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-[11px] font-semibold bg-primary-50 text-primary-700 rounded-md"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            핵심 성과
          </h4>
          {project.achievements.map((a, i) => (
            <AchievementSection key={i} achievement={a} index={i} />
          ))}
        </div>

        {/* Technical Depth - Collapsible */}
        <div className="border-t border-slate-100 pt-4 mt-4">
          <button
            onClick={() => setShowDepth(!showDepth)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors w-full"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${showDepth ? 'rotate-90' : ''}`}
            >
              <path d="M5 3l5 4-5 4" />
            </svg>
            기술적 깊이
          </button>
          {showDepth && (
            <ul className="mt-3 space-y-1.5 ml-5">
              {project.technicalDepth.map((item, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="shrink-0 w-1 h-1 bg-slate-400 rounded-full mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Learning Points - Collapsible */}
        <div className="border-t border-slate-100 pt-4 mt-4">
          <button
            onClick={() => setShowLearning(!showLearning)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors w-full"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${showLearning ? 'rotate-90' : ''}`}
            >
              <path d="M5 3l5 4-5 4" />
            </svg>
            러닝 포인트
          </button>
          {showLearning && (
            <ul className="mt-3 space-y-1.5 ml-5">
              {project.learningPoints.map((item, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="shrink-0 w-1 h-1 bg-slate-400 rounded-full mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
