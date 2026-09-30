import { describe, expect, it } from 'vitest'
import {
  CONFIRM_DELETE_TIMEOUT_MS,
  getDeleteButtonAriaLabel,
} from './confirmDeleteHelpers'

describe('ConfirmDeleteButton helpers', () => {
  it('has a 4-second confirmation timeout window', () => {
    expect(CONFIRM_DELETE_TIMEOUT_MS).toBe(4000)
  })

  it('generates generic accessible labels when no itemLabel is provided', () => {
    expect(getDeleteButtonAriaLabel(false)).toBe('Delete item')
    expect(getDeleteButtonAriaLabel(true)).toBe('Confirm delete item')
  })

  it('generates contextual accessible labels when itemLabel is provided', () => {
    expect(getDeleteButtonAriaLabel(false, 'Senior Developer')).toBe('Delete Senior Developer')
    expect(getDeleteButtonAriaLabel(true, 'Senior Developer')).toBe('Confirm delete Senior Developer')
  })

  it('handles empty itemLabel with fallback to item', () => {
    expect(getDeleteButtonAriaLabel(false, '')).toBe('Delete item')
    expect(getDeleteButtonAriaLabel(true, '')).toBe('Confirm delete item')
  })
})
