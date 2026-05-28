export function slugify(city: string, state: string): string {
  const citySlug = city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${citySlug}-${state.toLowerCase()}`
}

export function parseSlug(slug: string): { city: string; state: string } | null {
  const lastHyphen = slug.lastIndexOf('-')
  if (lastHyphen < 1 || lastHyphen === slug.length - 1) return null
  const cityPart = slug.slice(0, lastHyphen)
  const state = slug.slice(lastHyphen + 1).toUpperCase()
  const city = cityPart
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return { city, state }
}
