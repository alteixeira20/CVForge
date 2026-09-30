export const CONFIRM_DELETE_TIMEOUT_MS = 4000

export function getDeleteButtonAriaLabel(isArmed: boolean, itemLabel?: string): string {
  const target = itemLabel ? ` ${itemLabel}` : ' item'
  return isArmed ? `Confirm delete${target}` : `Delete${target}`
}
