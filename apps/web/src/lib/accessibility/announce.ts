export const ANNOUNCEMENT_EVENT = 'cvforge:announce'

export function announce(message: string) {
  window.dispatchEvent(new CustomEvent<string>(ANNOUNCEMENT_EVENT, { detail: message }))
}
