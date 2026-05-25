import { type CVState } from '../cv'
import { CVStateSchema } from './schemas'

export function parseCVState(value: unknown): CVState | null {
  const result = CVStateSchema.safeParse(value);
  if (result.success) {
    return result.data;
  }
  return null;
}
