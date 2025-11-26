import { useEffect, useRef } from "react"
import Head from "next/head"
import Link from "next/link"
import Navigation from "@/components/layout/navigation/navigation"
import Footer from "@/components/layout/footer/footer"
import Testimonials from "@/components/features/testimonials/testimonials"
import BlogsSection from "@/components/features/blogs-section/blogs-section"
import dynamic from "next/dynamic"
import Image from "next/image"
import { getAllPostsServer } from "../lib/blog-server"
import { useGlobalLeadFormState, useLightboxStore } from "@/zustand"
import { GetStaticProps } from "next"
import SEOImage from "@/components/common/seo-image/seo-image"
import { Button } from "@/components/common/ui/button" // shadcn/ui button
import { motion } from "framer-motion" // For animations
import { OrganizationSchema } from "@/components/common/schema/OrganizationSchema"
import { LocalBusinessSchema } from "@/components/common/schema/LocalBusinessSchema"
import { ReviewSchema } from "@/components/common/schema/ReviewSchema"
import { WebSiteSchema } from "@/components/common/schema/WebSiteSchema"

const Lightbox = dynamic(
  () => import("@/components/features/lightbox/lightbox"),
  { ssr: false }
)
const Carousel = dynamic(
  () => import("@/components/features/carousel-op/carousel-op"),
  {
    ssr: false,
  }
)

interface Post {
  id: number
  title: string
  link: string
  date: string
  datetime: string
  description: string
  category: string
  author: {
    name: string
    role: string
    imageUrl: string
  }
}
// Replace your testimonials array with this properly formatted version:

const testimonials = [
  {
    name: "Saad Arshad",
    stars: [true, true, true, true, "half"] as const,
    testimonial:
      "Highly committed to delivering in timelines, I wholeheartedly recommend considering investment in projects by Narkin's Builders.",
    avatar:
      "/media/common/testimonials/saad-arshad-testimonial-narkins-builders.webp",
  },
  {
    name: "Arsalan",
    stars: [true, true, true, true, true] as const,
    testimonial:
      "Smooth booking experience, very transparent throughout the process.",
    avatar:
      "/media/common/testimonials/arsalan-testimonial-narkins-builders.webp",
  },
  {
    name: "Umair Iqrar",
    stars: [true, true, true, true, "half"] as const,
    testimonial:
      "I decided to invest during the initial launch phase, and after just two years, I've seen substantial returns. It's been a fantastic investment opportunity!",
    avatar:
      "/media/common/testimonials/umair-iqrar-testimonial-narkins-builders.webp",
  },
] as const

export default function Index({ posts }: { posts: any[] }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const setOpen = useGlobalLeadFormState(
    (state: { setOpen: any }) => state.setOpen
  )

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.playsInline = true

      // Lazy load video when it becomes visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Load and play video only when visible
              video.load()
              video
                .play()
                .catch((error) => console.error("Video play failed", error))
              observer.unobserve(video)
            }
          })
        },
        { threshold: 0.1 }
      )

      observer.observe(video)

      return () => observer.disconnect()
    }
  }, [])
  const openLightbox = useLightboxStore((state) => state.openLightbox)
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>
          Apartments on Installments Bahria Town | Ready to Move | Narkin's
          Builders
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Ready apartments in Bahria Town from PKR 45 Lakh. Easy installments, immediate possession. 2, 3 & 4 BHK luxury apartments with gym, pool & security. Hill Crest Residency ready to move - Call 0320-324-3970"
        />
        <meta
          name="keywords"
          content="apartments on installments Bahria Town, ready apartments Bahria Town Karachi, apartments under 50 lakh Bahria Town, Hill Crest Residency Bahria Town, best apartments in Bahria Town Karachi, Narkin's Boutique Residency apartments, easy monthly installments apartments Karachi, 2 bedroom apartments Bahria Town, 3 bedroom apartments Bahria Town, luxury apartments with security Karachi, gated community apartments Bahria Town, apartments near me Bahria Town Karachi, immediate possession apartments Bahria Town"
        />
        <meta name="author" content="Narkin's Builders" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Apartments on Installments Bahria Town | Ready to Move | Narkin's Builders"
        />
        <meta
          property="og:description"
          content="Ready apartments in Bahria Town from PKR 45 Lakh. Easy installments, immediate possession. 2, 3 & 4 BHK luxury apartments with gym, pool & security. Call 0320-324-3970"
        />
        <meta property="og:url" content="https://www.narkinsbuilders.com/" />
        <meta
          property="og:image"
          content="https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo-30-years-experience.webp"
        />
        <meta property="og:site_name" content="Narkin's Builders" />
        <meta property="og:locale" content="en_US" />

        {/* Instagram/Social Media Optimization */}
        <meta name="instagram:account" content="@narkinsbuilders" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Narkin's Builders - Premium Apartments in Bahria Town Karachi"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.narkinsbuilders.com/" />

        {/* Favicon (if you have one) */}
        <link rel="icon" href="/favicon.ico" />

        {/* Resource Hints for Performance */}
        <link
          rel="preload"
          href="/media/nbr/exterior/narkins-boutique-residency-exterior-heritage-commercial-bahria-town.webp"
          as="image"
        />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </Head>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <ReviewSchema />
      <WebSiteSchema />
      <Navigation fixed={true} />
      <div>
        <header className="relative flex items-center justify-center min-h-[70vh] overflow-hidden">
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto px-4"
            >
              <p className="text-lg text-neutral-300">Welcome to</p>
              <h1 className="hero-title mt-4 text-white">
                Narkin&apos;s Builders
              </h1>
              <p className="large-text mt-4 text-white">
                Creating Iconic Living Experiences.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button
                  onClick={() => setOpen(true)}
                  className="border bg-primary border-white text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Get More Information
                </Button>
              </div>
            </motion.div>
          </div>
          <video
            ref={videoRef}
            preload="none"
            poster="/media/nbr/exterior/narkins-boutique-residency-exterior-heritage-commercial-bahria-town.webp"
            className="max-h-screen absolute w-auto min-w-full min-h-full object-cover brightness-50"
            loop
            autoPlay
            playsInline
            muted
            controls={false}
            disablePictureInPicture
          >
            <source
              src="/media/videos/hero/C_Narkins_Exterior.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </header>
      </div>

      {/* Narkin's Boutique Residency Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carousel for Desktop */}
          <div className="hidden lg:block">
            <Carousel
              swipe
              hideArrows={false}
              autoPlay
              slideShow
              hideIndicators
              loop
              rightToLeft
              keyboard
              displayMode="default"
              interval={10000}
              dataSource={[
                "/media/nbr/exterior/narkins-boutique-residency-exterior-heritage-commercial-bahria-town.webp",
                "/media/nbr/exterior/narkins-boutique-residency-amenities-pool-gym-facilities.webp",
                "/media/nbr/exterior/narkins-boutique-residency-sky-villa-duplex-penthouse.webp",
                "/media/nbr/exterior/narkins-boutique-residency-grand-lobby-reception-area.webp",
              ].map((i) => ({ image: i }))}
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Heading */}
            <div className="text-left mb-10">
              <h2 className="subsection-title tracking-tight text-white">
                Narkin&apos;s Boutique Residency
              </h2>
              <p className="mt-4 large-text text-neutral-300">
                Narkin&apos;s Boutique Residency in Bahria Town Karachi offers
                luxury and bespoke design in a Heritage Commercial area. With 20
                floors, it features 2, 3, and 4-bedroom luxury apartments with
                panoramic views. Residents enjoy access to over 10 premium
                amenities, including fitness facilities, indoor swimming pools,
                and recreational areas. Experience the epitome of sophistication
                at Narkin&apos;s Boutique Residency.
              </p>
            </div>
            <Button
              asChild
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Link href="/narkins-boutique-residency">
                Project Info <span aria-hidden="true">&rarr;</span>
              </Link>
            </Button>
          </motion.div>

          {/* Carousel for Mobile */}
          <div className="lg:hidden">
            <Carousel
              swipe
              hideArrows={false}
              autoPlay
              slideShow
              hideIndicators
              loop
              rightToLeft
              displayMode="default"
              interval={10000}
              dataSource={[
                "/media/nbr/exterior/narkins-boutique-residency-exterior-heritage-commercial-bahria-town.webp",
                "/media/nbr/exterior/narkins-boutique-residency-amenities-pool-gym-facilities.webp",
                "/media/nbr/exterior/narkins-boutique-residency-sky-villa-duplex-penthouse.webp",
                "/media/nbr/exterior/narkins-boutique-residency-grand-lobby-reception-area.webp",
              ].map((i) => ({ image: i }))}
            />
          </div>
        </div>
      </section>

      {/* Hill Crest Residency Section */}
      <section className="relative flex items-center justify-center bg-cover bg-center bg-fixed">
        {/* Background Image with Overlay - FIXED */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/media/hcr/exterior/hill-crest-residency-exterior-view-bahria-town-karachi.webp')",
          }}
        >
          <div className="absolute inset-0 bg-black/80"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto py-10 px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <h2 className="subsection-title tracking-tight text-white">
                Hill Crest Residency
              </h2>
              <p className="mt-4 large-text text-neutral-300">
                Located just a minute from the main gate, Hill Crest Residency
                offers beautiful ready-to-move-in apartments in Bahria Town
                Karachi. Choose from a variety of 2, 3, and 4-bedroom luxury
                apartments designed for modern living. If you're looking for a
                home that combines comfort, style, and convenience, schedule a
                tour today to see what makes Hill Crest Residency special.
              </p>
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Link href="/hill-crest-residency">
                  Project Info <span aria-hidden="true">&rarr;</span>
                </Link>
              </Button>
            </motion.div>

            {/* Image for Desktop */}
            <div className="hidden-lg:block">
              <Image
                src="/media/hcr/exterior/hill-crest-residency-exterior-view-bahria-town-karachi.webp"
                alt="Hill Crest Residency"
                width={800}
                height={600}
                className="rounded-lg"
                priority
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
              {/* Masonry Grid Gallery */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[
                  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-interior-living-room-luxury.webp",
                  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-bedroom-master-suite.webp",
                  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-kitchen-modern-design.webp",
                  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-bathroom-luxury-fixtures.webp",
                ].map((src, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => openLightbox({ src })}
                  >
                    <SEOImage
                      src={src}
                      width={500}
                      height={300}
                      context="gallery"
                      index={index}
                      className="w-full h-auto object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                        View
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16">
        <CompletedProjects />
      </section>

      {/* Trusted Partners Section */}
      <section className="bg-neutral-50 border-t py-16">
        <TrustedPartners />
      </section>

      {/* Testimonials Section */}
      <section className="bg-white border-t px-5 lg:px-8 py-20">
        <Testimonials testimonials={testimonials} />
      </section>
      <section className="bg-white border-b px-4 lg:px-8 py-20 w-full">
        <div className="ml-auto">
          <figure className="max-w-screen-md ml-auto text-right">
            <svg
              className="w-10 h-10 mr-auto mb-3 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 14"
            >
              <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
            </svg>
            <blockquote>
              <p className="text-lg italic text-gray-900">
                "At Narkin's Builders, we prioritize commitment, transparency,
                and innovation. For over 30 years, these values have fueled our
                success, driving us to deliver cutting-edge construction
                projects and luxury living spaces that exceed expectations. Our
                transparent approach ensures our customers are informed and
                involved, while our innovative solutions push the boundaries of
                what's possible. Thank you for choosing Narkin's Builders as
                your trusted partner in building your dream home."
              </p>
            </blockquote>
            <figcaption className="flex items-center justify-end mt-6 space-x-3 rtl:space-x-reverse">
              <div className="flex items-center divide-x-2 rtl:divide-x-reverse divide-gray-500">
                <cite className="pe-3 text-gray-900">Mr. Ashraf Nara</cite>
                <cite className="ps-3 text-sm text-gray-500">
                  CEO at Narkin's
                </cite>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Blogs Section */}
      <BlogsSection posts={posts} />

      {/* Footer */}
      <Footer map="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.887654842134!2d67.31088117394069!3d25.003933139504262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34b0d0e2f0313%3A0x82f9da3499b223b1!2sHill%20Crest%20Residency!5e0!3m2!1sen!2s!4v1751481865917!5m2!1sen!2s" />
      <Lightbox />
    </>
  )
}

// CHANGED: Transform MDX data to match BlogsSection expected format
export const getStaticProps: GetStaticProps = async () => {
  try {
    // Get latest 3 general blog posts from MDX (excluding specific project mentions)
    const mdxPosts = getAllPostsServer("general").slice(0, 3)

    // Transform MDX format to match BlogsSection expected format
    const posts = mdxPosts.map((post, index) => {
      // Generate the new URL format /blog/year/month/slug
      const postDate = new Date(post.date)
      const year = postDate.getFullYear()
      const month = String(postDate.getMonth() + 1).padStart(2, "0")

      return {
        id: index + 1,
        slug: post.slug,
        title: post.title,
        link: `/blog/${year}/${month}/${post.slug}`,
        date: post.date,
        datetime: post.date,
        description: post.excerpt,
        excerpt: post.excerpt,
        category: "Real Estate",
        image: post.image,
        author: {
          name: "Narkin's Builders",
          role: "Real Estate Expert",
          imageUrl:
            "/media/common/logos/narkins-builders-logo-30-years-experience.webp",
        },
      }
    })

    return {
      props: { posts },
      revalidate: 60,
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return { props: { posts: [] } }
  }
}

export function CompletedProjects() {
  const projects = [
    {
      image:
        "/media/completed-projects/al-arz-terrace-completed-project-narkins-builders-karachi.webp",
      title: "Al Arz Terrace",
      description: "Luxury living with panoramic views.",
    },
    {
      image:
        "/media/completed-projects/al-arz-homes-completed-project-narkins-builders-karachi.webp",
      title: "Al Arz Home",
      description: "Elegant designs for modern families.",
    },
    {
      image:
        "/media/completed-projects/palm-residency-completed-project-frere-town-karachi.webp",
      title: "Palm Residency",
      description: "Tranquil surroundings with premium amenities.",
    },
    {
      image:
        "/media/completed-projects/classic-heights-completed-project-sharfabad-karachi.webp",
      title: "Sharfabad Residency",
      description: "A blend of tradition and modernity.",
    },
  ]

  return (
    <div className="container mx-auto px-4">
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h2 className="subsection-title tracking-tight text-black">
          Completed Projects
        </h2>
        <p className="mt-4 large-text text-neutral-700">
          At Narkins Builders & Developers, we deliver what we commit.
        </p>
      </motion.div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image */}
            <Image
              src={project.image}
              alt={project.title}
              width={600}
              height={400}
              className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
              priority={index < 2}
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="subheading text-white">{project.title}</h3>
              <p className="mt-2 body-text text-white">{project.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function TrustedPartners() {
  // SEO-optimized partner data with descriptive alt texts
  const partners = [
    {
      src: "/media/common/trusted-partners/agha-steel-industries-construction-manufacturing-partner-pakistan.webp",
      alt: "Agha Steel Industries - Leading steel manufacturing partner for construction projects in Pakistan",
      company: "Agha Steel Industries",
    },
    {
      src: "/media/common/trusted-partners/city-tiles-ceramics-flooring-construction-partner-karachi-pakistan.webp",
      alt: "City Tiles - Premium ceramic tiles and flooring solutions partner for luxury apartments in Karachi",
      company: "City Tiles",
    },
    {
      src: "/media/common/trusted-partners/ghani-glass-industries-float-glass-manufacturing-partner-pakistan.webp",
      alt: "Ghani Glass Industries - Float glass and container glass manufacturing partner for construction projects",
      company: "Ghani Glass Industries",
    },
    {
      src: "/media/common/trusted-partners/gobis-paints-construction-coating-solutions-partner-pakistan.webp",
      alt: "Gobis Paints - Premium paint and coating solutions partner for luxury residential projects",
      company: "Gobis Paints",
    },
    {
      src: "/media/common/trusted-partners/lacasa-architects-engineering-consultants-design-partner-pakistan.webp",
      alt: "LACASA Architects & Engineering Consultants - Architectural design and engineering partner for Bahria Town projects",
      company: "LACASA Architects",
    },
    {
      src: "/media/common/trusted-partners/lucky-cement-construction-materials-manufacturing-partner-pakistan.webp",
      alt: "Lucky Cement - Premium cement and construction materials manufacturing partner for residential projects",
      company: "Lucky Cement",
    },
    {
      src: "/media/common/trusted-partners/patex-engineering-construction-technology-partner-pakistan.webp",
      alt: "Patex Engineering - Construction technology and engineering solutions partner for modern apartments",
      company: "Patex Engineering",
    },
  ]

  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="subsection-title tracking-tight text-white">
            Our Trusted Partners
          </h2>
          <p className="mt-4 large-text text-neutral-300 max-w-2xl mx-auto">
            We collaborate with Pakistan's leading construction, manufacturing,
            and design companies to deliver exceptional quality in every project
          </p>
        </motion.div>

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={160}
                height={100}
                className="w-full h-auto rounded-lg object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                quality={85}
                loading="lazy"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 160px"
                title={`${partner.company} - Trusted Partner of Narkin's Builders`}
              />
            </motion.div>
          ))}
        </div>

        {/* Partner Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-neutral-400 max-w-4xl mx-auto">
            Our partnership network spans across Steel Manufacturing, Ceramic
            Tiles, Glass Industries, Premium Paints, Architecture & Engineering,
            Cement Manufacturing, and Construction Technology - ensuring
            world-class quality in every Narkin's Builders project.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
