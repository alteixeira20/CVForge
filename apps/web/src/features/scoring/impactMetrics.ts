const NUMBER = String.raw`\d+(?:[.,]\d+)?`
const SCALED_NUMBER = String.raw`${NUMBER}\s*(?:k|m|mil|milh(?:ão|ões))?`

const IMPACT_PATTERNS = [
  new RegExp(String.raw`\b${NUMBER}\s*%`, 'i'),
  new RegExp(String.raw`(?:[$€£]\s*${SCALED_NUMBER}|${SCALED_NUMBER}\s*(?:€|euros?|usd|gbp|d[oó]lares?))\b`, 'i'),
  new RegExp(String.raw`\b(?:reduced?|cut|decreased?|shortened|saved|poup(?:ei|ou)|reduzi|diminu[ií])\b.{0,45}\b${NUMBER}\s*(?:ms|milliseconds?|s|seconds?|segundos?|minutes?|minutos?|hours?|horas?|days?|dias?|weeks?|semanas?|months?|meses?)\b`, 'i'),
  new RegExp(String.raw`\b(?:latency|response time|load time|tempo de resposta|lat[eê]ncia)\b.{0,35}\b${NUMBER}\s*(?:ms|milliseconds?|s|seconds?|segundos?)\b`, 'i'),
  new RegExp(String.raw`\b${SCALED_NUMBER}\s+(?:active\s+)?(?:users?|customers?|clients?|utilizadores?|clientes?|requests?|pedidos?|orders?|encomendas?|transactions?|transa[cç][oõ]es|records?|registos?|employees?|colaboradores?|locations?|pa[ií]ses|countries|teams?|equipas?)\b`, 'i'),
  new RegExp(String.raw`\b${SCALED_NUMBER}\s+(?:requests?|pedidos?|transactions?|transa[cç][oõ]es|operations?|opera[cç][oõ]es)\s*(?:\/|per|por)\s*(?:second|minute|hour|day|segundo|minuto|hora|dia)\b`, 'i'),
  new RegExp(String.raw`\b(?:grew|growth|increased?|boosted|expanded|scaled|cresci|crescimento|aumentei|aumentou|expandi)\b.{0,45}\b${NUMBER}\s*(?:%|x|users?|customers?|clientes?|revenue|receita)?\b`, 'i'),
  new RegExp(String.raw`\b(?:revenue|receita|costs?|custos?|savings?|poupan[cç]as?|margin|margem)\b.{0,45}(?:[$€£]\s*)?${SCALED_NUMBER}\b`, 'i'),
  new RegExp(String.raw`\b(?:errors?|defects?|incidents?|failures?|erros?|defeitos?|incidentes?|falhas?|churn|downtime)\b.{0,45}\b(?:reduced?|down|decreased?|cut|reduzi|diminuiu)\b.{0,25}\b${NUMBER}\s*%?\b`, 'i'),
  new RegExp(String.raw`\b(?:reduced?|cut|decreased?|reduzi|diminuiu)\b.{0,35}\b${NUMBER}\s*%?\b.{0,35}\b(?:errors?|defects?|incidents?|failures?|erros?|defeitos?|incidentes?|falhas?|costs?|custos?|latency|lat[eê]ncia)\b`, 'i'),
  new RegExp(String.raw`\b${NUMBER}\s+(?:deployments?|releases?|entregas?|lan[cç]amentos?)\s*(?:\/|per|por)\s*(?:day|week|month|dia|semana|m[eê]s)\b`, 'i'),
  new RegExp(String.raw`\b(?:from|de)\s+${NUMBER}\s+(?:to|para)\s+${NUMBER}\b.{0,35}\b(?:deployments?|releases?|days?|hours?|minutes?|entregas?|dias?|horas?|minutos?)\b`, 'i'),
]

export function hasQuantifiedImpact(value: string) {
  const normalized = value.normalize('NFC').replace(/\s+/g, ' ').trim()
  if (!normalized) return false
  const withoutIdentifiers = normalized
    .replace(/\b(?:react|version|vers[aã]o|tier|http|python|sprint)\s*v?\d+(?:[.,]\d+)?\b/gi, '')
    .replace(/\b(?:19|20)\d{2}\b/g, '')
  return IMPACT_PATTERNS.some((pattern) => pattern.test(withoutIdentifiers))
}
