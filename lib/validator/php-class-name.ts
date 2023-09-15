export default function (name: string): boolean {
  if (!name) {
    return true
  }

  return /^[A-Z\\][\w\\]+[\dA-Za-z]$/.test(name)
}
