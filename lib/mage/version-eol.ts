export default function (version: string): Date {
  if (version.startsWith('2.3.')) {
    return new Date('2022-09-30')
  } else if (version.startsWith('2.4.4') || version.startsWith('2.4.5')) {
    return new Date('2024-11-25')
  } else if (version.startsWith('2.4.6')) {
    return new Date('2026-03-14')
  } else if (version.startsWith('2.4.')) {
    return new Date('2022-11-28')
  }

  throw new Error(`Unknown version: ${version}`)
}
