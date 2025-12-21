export interface ImageMetadata {
  // Required fields
  loc: string // URL of the page containing the image
  imageUrl: string // URL of the image

  // Optional but recommended fields
  caption?: string // Caption of the image
  geoLocation?: string // Geographic location of the image
  title?: string // Title of the image
  license?: string // URL to the license of the image
}

export type ImageSource = 'blog' | 'property' | 'gallery' | 'other'

export interface ImageDetectionResult {
  source: ImageSource
  images: ImageMetadata[]
  errors?: string[]
}
