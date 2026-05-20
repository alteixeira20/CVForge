import { useState, useEffect } from 'react'

function getDevicePixelRatio() {
  return typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1
}

export function useDevicePixelRatio() {
  const [dpr, setDpr] = useState(() => getDevicePixelRatio())
  useEffect(() => {
    const mql = window.matchMedia(`(resolution: ${dpr}dppx)`)
    const handler = () => setDpr(getDevicePixelRatio())
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [dpr])
  return dpr
}
