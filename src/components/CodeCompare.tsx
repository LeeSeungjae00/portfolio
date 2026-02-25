import { useState } from 'react'

interface CodeCompareProps {
  title: string
  beforeLabel: string
  afterLabel: string
  beforeCode: string
  afterCode: string
  beforeCaption?: string
  afterCaption?: string
}

export default function CodeCompare({
  title,
  beforeLabel,
  afterLabel,
  beforeCode,
  afterCode,
  beforeCaption,
  afterCaption,
}: CodeCompareProps) {
  const [tab, setTab] = useState<'before' | 'after'>('before')

  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between bg-slate-50 px-4 py-2 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setTab('before')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'before'
                ? 'bg-amber-100 text-amber-800'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {beforeLabel}
          </button>
          <button
            onClick={() => setTab('after')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'after'
                ? 'bg-emerald-100 text-emerald-800'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {afterLabel}
          </button>
        </div>
      </div>

      {(tab === 'before' ? beforeCaption : afterCaption) && (
        <div
          className={`px-4 py-2 text-xs font-medium border-b ${
            tab === 'before'
              ? 'bg-amber-50 text-amber-700 border-amber-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}
        >
          {tab === 'before' ? beforeCaption : afterCaption}
        </div>
      )}

      <div className="bg-[#1e293b] p-4 overflow-x-auto">
        <pre className="m-0">
          <code className="text-slate-300 whitespace-pre">
            {tab === 'before' ? beforeCode : afterCode}
          </code>
        </pre>
      </div>
    </div>
  )
}
