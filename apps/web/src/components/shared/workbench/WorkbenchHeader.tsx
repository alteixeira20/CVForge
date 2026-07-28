import { type ReactNode } from 'react'

interface WorkbenchHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  sticky?: boolean
  className?: string
}

export function WorkbenchHeader({
  eyebrow,
  title,
  description,
  actions,
  sticky = true,
  className = '',
}: WorkbenchHeaderProps) {
  const stickyClasses = sticky 
    ? 'sticky top-0 z-20 bg-bg/95 backdrop-blur-md shadow-sm border-b border-border' 
    : ''

  return (
    <header className={`${stickyClasses} px-5 lg:px-8 py-3 lg:py-4 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="workspace-head compact !mb-0">
          {eyebrow && (
            <div className="crumbline hidden lg:block">
              {eyebrow}
            </div>
          )}
          <h1>{title}</h1>
          {description && (
            <p className="muted text-[11px] leading-relaxed max-w-sm mt-1 hidden lg:block">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="pt-1">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
