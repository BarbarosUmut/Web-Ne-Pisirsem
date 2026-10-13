import type { ReactNode } from 'react'

interface EmptyStateProps {
  emoji: string
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-3 text-5xl">{emoji}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
