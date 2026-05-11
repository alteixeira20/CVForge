'use client'

import { type TextareaHTMLAttributes, useEffect, useRef } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  autoResize?: boolean
}

export function TextArea({ className = '', autoResize = true, ...props }: TextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoResize && ref.current) {
      const textarea = ref.current
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [props.value, autoResize])

  return (
    <textarea
      ref={ref}
      className={`w-full bg-bg-2 border border-border rounded-lg px-12 py-10 text-sm text-ink placeholder:text-ink-4 focus:border-ember focus:ring-[3px] focus:ring-lava-glow outline-none transition-all resize-none min-h-[80px] ${className}`}
      {...props}
    />
  )
}
