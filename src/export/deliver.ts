// Hands an exported file to the user (TASK 005): the phone's Share sheet where
// the browser can share files (Messenger, Gmail, Viber, Drive), otherwise the
// anchor download the Settings backup card uses. A cancelled Share sheet is
// not an error. Browser APIs only, so this file is not under Vitest; the page
// checks in the task record cover it.
export type Delivery = 'shared' | 'saved' | 'cancelled'

export async function deliverFile(blob: Blob, name: string, type: string): Promise<Delivery> {
  const file = new File([blob], name, { type })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      throw err
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
  return 'saved'
}
