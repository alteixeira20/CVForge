import { describe, expect, it } from 'vitest'
import { hasQuantifiedImpact } from './impactMetrics'

describe('hasQuantifiedImpact', () => {
  it.each([
    'Reduced checkout errors by 32%.',
    'Saved €120k in annual infrastructure costs.',
    'Cut response time by 180 ms.',
    'Scaled the service to 45,000 users.',
    'Processed 2,400 requests per second.',
    'Increased revenue by $1.2m.',
    'Reduced latency to 95ms.',
    'Reduced production incidents by 40%.',
    'Delivered 12 releases per month.',
    'Reduzi os custos em 18%.',
    'Apoiei 3 mil clientes em Portugal.',
  ])('recognizes a likely measurable outcome: %s', (bullet) => {
    expect(hasQuantifiedImpact(bullet)).toBe(true)
  })

  it.each([
    'Migrated the application to React 18.',
    'Released version 2 of the component library.',
    'Handled Tier 1 support.',
    'Enabled HTTP 2.',
    'Joined the company in 2024.',
    'Integrated the ZX-900 product model.',
    'Worked on sprint 12.',
    'Maintained Python 3 services.',
  ])('does not treat an isolated identifier as impact: %s', (bullet) => {
    expect(hasQuantifiedImpact(bullet)).toBe(false)
  })
})
