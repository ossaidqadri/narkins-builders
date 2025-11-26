// Server-side only FAQ loader for Node.js environments
// This file should only be imported in getStaticProps, getServerSideProps, or API routes

import fs from "fs"
import path from "path"

export interface FAQ {
  id: string
  question: string
  answer: string
  tags: string[]
  priority: number
}

export interface FAQCollection {
  title: string
  description: string
  category: string
  projectId?: string
  faqs: FAQ[]
}

const FAQ_DIRECTORY = path.join(process.cwd(), "content/faqs")

// Get all FAQ collections
export function getAllFAQCollections(): string[] {
  if (!fs.existsSync(FAQ_DIRECTORY)) {
    return []
  }

  return fs
    .readdirSync(FAQ_DIRECTORY)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""))
}

// Get specific FAQ collection by name
export function getFAQCollection(collectionName: string): FAQCollection | null {
  try {
    const filePath = path.join(FAQ_DIRECTORY, `${collectionName}.json`)

    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error loading FAQ collection ${collectionName}:`, error)
    return null
  }
}

// Get FAQs by category
export function getFAQsByCategory(category: string): FAQ[] {
  const collections = getAllFAQCollections()
  const allFaqs: FAQ[] = []

  collections.forEach((collectionName) => {
    const collection = getFAQCollection(collectionName)
    if (collection && collection.category === category) {
      allFaqs.push(...collection.faqs)
    }
  })

  return allFaqs.sort((a, b) => a.priority - b.priority)
}

// Get project-specific FAQs
export function getProjectFAQs(projectId: string): FAQ[] {
  const collection = getFAQCollection(projectId)
  if (collection && collection.projectId === projectId) {
    return collection.faqs.sort((a, b) => a.priority - b.priority)
  }
  return []
}
