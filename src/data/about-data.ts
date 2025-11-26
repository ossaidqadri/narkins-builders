// data/about-data.ts
interface Achievement {
  number: string
  label: string
}

interface CompanyValue {
  title: string
  description: string
  icon: string
}

interface Project {
  year: string
  title: string
  description: string
  status: string
}

interface YoutubeVideo {
  id: string
  title: string
  project: string
}

interface FeaturedVideo {
  id: string
  title: string
  description: string
  category: string
}

export const achievements: Achievement[] = [
  { number: "30+", label: "Years of Excellence" },
  { number: "5", label: "Projects Delivered" },
  { number: "500+", label: "Happy Families" },
  { number: "100%", label: "On-Time Delivery" },
]

export const values: CompanyValue[] = [
  {
    title: "Reliability",
    description:
      "30+ years of on-time project delivery in Karachi's most sought-after locations",
    icon: "🏗️",
  },
  {
    title: "Innovation",
    description:
      "Smart apartments with modern technology and sustainable building practices",
    icon: "💡",
  },
  {
    title: "Quality",
    description:
      "Premium construction materials and meticulous attention to detail",
    icon: "⭐",
  },
]

export const projects: Project[] = [
  {
    year: "2025",
    title: "Narkin's Boutique Residency",
    description:
      "Luxury apartments with Heritage Club and Danzoo Safari views in Heritage Commercial area",
    status: "Completing",
  },
  {
    year: "2024",
    title: "Hill Crest Residency",
    description:
      "Successfully delivered flagship smart apartment project with cutting-edge technology",
    status: "Delivered",
  },
  {
    year: "2023",
    title: "Classic Heights",
    description: "Premium residential project in Sharfabad, Karachi",
    status: "Completed",
  },
  {
    year: "2022",
    title: "Palm Residency",
    description: "Modern living spaces in Frere Town, Karachi",
    status: "Completed",
  },
  {
    year: "2021",
    title: "Al Arz Homes",
    description: "Contemporary residential development in prime location",
    status: "Completed",
  },
]

export const hcrYoutubeVideos: YoutubeVideo[] = [
  { id: "TSiLOTW2s4g", title: "Hill Crest Residency Tour", project: "HCR" },
  { id: "5zv639iO31w", title: "Luxury Living at Hill Crest", project: "HCR" },
  { id: "D5YaV4CdaxE", title: "HCR Customer Review", project: "HCR" },
  {
    id: "iNbSrOL8HD4",
    title: "Hill Crest Residency Walkthrough",
    project: "HCR",
  },
]

export const nbrYoutubeVideos: YoutubeVideo[] = [
  {
    id: "FmEHTzdjXEc",
    title: "Narkin's Boutique Residency Tour",
    project: "NBR",
  },
  { id: "uzYVdqFHovs", title: "NBR Modern Amenities", project: "NBR" },
  { id: "n8PT4z9MdRA", title: "NBR Customer Testimonials", project: "NBR" },
  { id: "DClpF8-xaS8", title: "NBR Dream Home Experience", project: "NBR" },
]

export const innovationFeatures: string[] = [
  "Smart door locks and automated security systems",
  "Energy-efficient smart switches and lighting",
  "Advanced building management systems",
  "Premium amenities and recreational facilities",
]

export const whyChooseUs: string[] = [
  "30+ years of proven track record in Karachi",
  "Specialized expertise in Bahria Town developments",
  "100% on-time project delivery commitment",
  "Transparent pricing and customer communication",
  "Premium location selection and market analysis",
  "Post-delivery support and maintenance services",
]

// Featured videos for the about page
export const featuredVideos: FeaturedVideo[] = [
  {
    id: "tT7kkMM0pz0", // Replace with actual YouTube video ID
    title: "Client Reviews & Testimonials",
    description:
      "Hear what our satisfied customers say about their experience with Narkin's Builders",
    category: "testimonials",
  },
  {
    id: "9pJsF3BciCA", // Replace with actual YouTube video ID
    title: "Meet Our Architects",
    description:
      "Get insights from the creative minds behind our innovative designs",
    category: "team",
  },
  {
    id: "A3WkwMWBZ_8", // Replace with actual YouTube video ID
    title: "Sales Head Interview",
    description:
      "Learn about our commitment to customer satisfaction and market expertise",
    category: "team",
  },
  {
    id: "BLnpB8VTnJA", // NEW: Replace with actual YouTube video ID
    title: "NBR Construction Update",
    description:
      "Latest progress on Narkin's Boutique Residency construction and development",
    category: "project",
  },
]
