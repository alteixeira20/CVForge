export const PAGE_PADDING_VERTICAL = 34
export const PAGE_PADDING_HORIZONTAL = 50

export function printableHorizontalBounds(pageWidth: number) {
  return {
    left: PAGE_PADDING_HORIZONTAL,
    right: pageWidth - PAGE_PADDING_HORIZONTAL,
  }
}
