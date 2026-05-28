export const bgColors = [
  'from-blue-100 to-cyan-100 text-blue-700',
  'from-emerald-100 to-teal-100 text-emerald-700',
  'from-amber-100 to-yellow-100 text-amber-700',
  'from-violet-100 to-purple-100 text-violet-700',
  'from-rose-100 to-pink-100 text-rose-700',
  'from-cyan-100 to-sky-100 text-cyan-700',
  'from-orange-100 to-amber-100 text-orange-700',
  'from-teal-100 to-green-100 text-teal-700',
]

export function getColor(index: number) {
  return bgColors[index % bgColors.length]
}
