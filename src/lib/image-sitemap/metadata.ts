const SITE_URL = 'https://www.narkinsbuilders.com'

export function constructFullUrl(relativePath: string): string {
  // Ensure path starts with /
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`
  return `${SITE_URL}${path}`
}

export function isValidImageUrl(url: string): boolean {
  // Check if URL ends with common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
  const lowerUrl = url.toLowerCase()
  return imageExtensions.some(ext => lowerUrl.includes(ext))
}

export function generateImageCaption(title: string, altText?: string): string {
  if (altText && altText !== title) {
    return `${title} - ${altText}`
  }
  return title
}
