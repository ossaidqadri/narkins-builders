import { GetStaticProps } from "next"
import { useState } from "react"

import Image from "next/image"
import BlogsSection from "@/components/features/blogs-section/blogs-section"

import Navigation from "@/components/layout/navigation/navigation"
import VideoPlayer from "@/components/features/video-player/video-player"
import Footer from "@/components/layout/footer/footer"
import { Lightbox } from "@/components/features/lightbox/lightbox"
import Map from "@/components/features/map/map"
import Head from "next/head"
import Carousel from "@/components/features/carousel-op/carousel-op"
import { Card, CardContent, CardHeader } from "@/components/common/ui/card" // shadcn/ui Card
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/ui/tabs"
import { motion } from "framer-motion"
import type { BlogPost } from "@/lib/blog"
import { useLightboxStore } from "@/zustand"
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid"
import Testimonials from "@/components/features/testimonials/testimonials"
import { getAllPostsServer } from "@/lib/blog-server"
import SEOImage from "@/components/common/seo-image/seo-image"
import { HillCrestResidencySchema } from "@/components/common/schema/HillCrestResidencySchema"
import { VideoSchema } from "@/components/common/schema/VideoSchema"

interface PostWithCategory extends BlogPost {
  id: number
  link: string
  datetime: string
  description: string
  category: string
  author: {
    name: string
    role: string
    imageUrl: string
  }
}

const categories = ["2 Bed", "3 Bed", "4 Bed"]
const cards = [
  [
    {
      title: "2 Bed Diamond",
      size: "1276 Square Feet",
      location: "Jinnah View",
      image:
        "/media/hcr/floor-plans/hill-crest-residency-2-bedroom-diamond-plan-1009-sqft.webp",
    },
    {
      title: "2 Bed Gold",
      size: "1180 Square Feet",
      location: "Gold Safari View",
      image:
        "/media/hcr/floor-plans/hill-crest-residency-2-bedroom-gold-plan-933-sqft.webp",
    },
    {
      title: "2 Bed Sapphire",
      size: "881 Square Feet",
      location: "Sapphire Safari View",
      image:
        "/media/hcr/floor-plans/hill-crest-residency-2-bedroom-sapphire-plan-697-sqft.webp",
    },
  ],
  [
    {
      title: "3 Bed Platinum",
      size: "1884 Square Feet",
      location: "Jinnah View",
      image:
        "/media/hcr/floor-plans/hill-crest-residency-3-bedroom-platinum-plan-1490-sqft.webp",
    },
  ],
  [
    {
      title: "4 Bed Rhodium",
      size: "2594 Square Feet",
      location: "Jinnah View",
      image:
        "/media/hcr/floor-plans/hill-crest-residency-4-bedroom-rhodium-plan-1996-sqft.webp",
    },
    {
      title: "4 Bed Sapphire-A",
      size: "1756 Square Feet",
      location: "Safari View",
      image:
        "/media/hcr/floor-plans/hill-crest-residency-4-bedroom-sapphire-a-plan-1388-sqft.webp",
    },
  ],
]

const amenities = [
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-prayer-area-mosque-qibla-wall.webp",
    name: "Prayer Area",
    alt: "Hill Crest Residency in-house prayer area and mosque with qibla wall and luxury finishes",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-wudu-area-ablution-facility.webp",
    name: "Wudu Area",
    alt: "Hill Crest Residency wudu area with modern ablution facilities and marble finishes",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-steam-bath-sauna-wellness-center.webp",
    name: "Steam Bath",
    alt: "Hill Crest Residency steam bath and sauna wellness center for residents",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-gym-fitness-center-equipment.webp",
    name: "Gym",
    alt: "Hill Crest Residency modern gym and fitness center with premium equipment and training facilities",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-grand-lobby-reception-area.webp",
    name: "Grand Lobby",
    alt: "Hill Crest Residency grand lobby and reception area with luxury seating and premium finishes",
  },
]

const amenitiesCarousel = [
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-prayer-area-mosque-qibla-wall.webp",
    name: "Prayer Area - Qibla Wall",
    alt: "Hill Crest Residency prayer area with qibla wall",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-prayer-area-mosque-wide-angle.webp",
    name: "Prayer Area - Wide View",
    alt: "Hill Crest Residency prayer area wide angle view",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-prayer-area-mosque-interior.webp",
    name: "Prayer Area - Interior",
    alt: "Hill Crest Residency prayer area interior view",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-wudu-area-ablution-facility.webp",
    name: "Wudu Area",
    alt: "Hill Crest Residency wudu area ablution facility",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-wudu-area-washing-stations.webp",
    name: "Wudu Area - Washing Stations",
    alt: "Hill Crest Residency wudu area washing stations",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-steam-bath-sauna-wellness-center.webp",
    name: "Steam Bath",
    alt: "Hill Crest Residency steam bath and sauna",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-steam-bath-sauna-interior-view.webp",
    name: "Steam Bath - Interior",
    alt: "Hill Crest Residency steam bath interior view",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-steam-bath-sauna-seating-area.webp",
    name: "Steam Bath - Seating",
    alt: "Hill Crest Residency steam bath seating area",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-gym-fitness-center-equipment.webp",
    name: "Gym - Training Wall",
    alt: "Hill Crest Residency gym with training wall",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-gym-fitness-center-entrance.webp",
    name: "Gym - Entrance",
    alt: "Hill Crest Residency gym entrance area",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-gym-fitness-center-cardio-equipment.webp",
    name: "Gym - Cardio Equipment",
    alt: "Hill Crest Residency gym cardio equipment",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-gym-fitness-center-wide-view.webp",
    name: "Gym - Wide View",
    alt: "Hill Crest Residency gym wide view",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-grand-lobby-reception-area.webp",
    name: "Grand Lobby",
    alt: "Hill Crest Residency grand lobby reception",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-grand-lobby-luxury-seating.webp",
    name: "Grand Lobby - Seating",
    alt: "Hill Crest Residency grand lobby luxury seating",
  },
  {
    image:
      "/media/hcr/amenities/hill-crest-residency-grand-lobby-lounge-area.webp",
    name: "Grand Lobby - Lounge",
    alt: "Hill Crest Residency grand lobby lounge area",
  },
]

const galleryImages = [
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-interior-living-room-luxury.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-bedroom-master-suite.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-kitchen-modern-design.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-bathroom-luxury-fixtures.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-balcony-panoramic-view.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-dining-area-modern.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-guest-bedroom.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-guest-bathroom.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-storage-area.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-entrance-lobby.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-utility-room.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-family-lounge.webp",
  "/media/hcr/apartment-interiors/hill-crest-residency-apartment-powder-room.webp",
]

const youtubeVideos = [
  { id: "VfNMo5DDRrQ", title: "Tour of Hill Crest Residency", type: "youtube" },
  { id: "5zv639iO31w", title: "Luxury Living at Hill Crest", type: "youtube" },
  { id: "D5YaV4CdaxE", title: "Customer Review", type: "youtube" },
  // { id: "1P8vDFyHGu", title: "Facebook Post", type: "facebook" }, // Added Facebook post
  {
    id: "hEy1bb6vprY",
    title: "Hill Crest Residency Walkthrough",
    type: "youtube",
  },
  { id: "cneUzaJe-Cg", title: "Why Choose Hill Crest?", type: "youtube" },
]

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
]

const Amenities = () => {
  const [amenityIndex, setAmenityIndex] = useState(0)
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Heading and Subheading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl tracking-tight text-black sm:text-5xl">
          Amenities in Hill Crest Residency
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Explore the top-notch amenities designed to enhance your living
          experience.
        </p>
      </div>

      {/* Amenities Grid */}
      <div className="max-w-7xl w-full mx-auto">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {amenities.map((amenity, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <div className="relative aspect-[2/1] overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-900/10">
                <Image
                  src={amenity.image}
                  alt={amenity.alt}
                  width={500}
                  height={300}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {amenity.name}
                  </span>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Carousel Section */}
      <div className="mt-16 relative h-[30rem] md:h-[35rem] lg:h-[40rem] w-full rounded-xl overflow-hidden">
        <Carousel
          id="carousel"
          swipe
          autoPlay={false}
          slideShow={false}
          loop
          rightToLeft
          hideIndicators={true}
          onChange={setAmenityIndex}
          className="w-full h-full"
          displayMode="default"
          dataSource={amenitiesCarousel}
        />
      </div>
    </div>
  )
}

export default function HillCrestResidency({
  posts,
}: {
  posts: PostWithCategory[]
}) {
  const openLightbox = useLightboxStore((state) => state.openLightbox)

  return (
    <main>
      <Head>
        {/* Primary Meta Tags */}
        <title>
          Hill Crest Residency - Ready Apartments | Immediate Possession |
          Bahria Town
        </title>
        <meta
          name="description"
          content="✓ Ready to Move ✓ Completion Certificate Issued Oct 2025 ✓ 2/3/4 BHK from 45 Lakh ✓ Installments Available. Move in 30 days. Gym, Pool, Steam Bath & Security. Call 0320-324-3970"
        />
        <meta
          name="keywords"
          content="Hill Crest Residency Bahria Town, ready apartments Bahria Town Karachi, immediate possession apartments, apartments on installments Bahria Town, completion certificate, best apartments in Bahria Town Karachi, luxury apartments with security Karachi, gated community apartments Bahria Town, 2 bedroom apartments Bahria Town, 3 bedroom apartments Bahria Town, apartments under 50 lakh Bahria Town"
        />
        <meta name="author" content="Narkin's Builders" />

        <link
          rel="canonical"
          href="https://www.narkinsbuilders.com/hill-crest-residency"
        />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Hill Crest Residency - Ready Apartments | Immediate Possession | Bahria Town"
        />
        <meta
          property="og:description"
          content="✓ Ready to Move ✓ Completion Certificate Issued Oct 2025 ✓ 2/3/4 BHK from 45 Lakh ✓ Installments Available. Move in 30 days. Call 0320-324-3970"
        />
        <meta
          property="og:url"
          content="https://www.narkinsbuilders.com/hill-crest-residency"
        />
        <meta
          property="og:image"
          content="https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo-30-years-experience.webp"
        />
        <meta property="og:site_name" content="Hill Crest Residency" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Hill Crest Residency - Ready Apartments | Immediate Possession | Bahria Town"
        />
        <meta
          name="twitter:description"
          content="✓ Ready to Move ✓ Completion Certificate Issued Oct 2025 ✓ 2/3/4 BHK from 45L ✓ Installments Available. Move in 30 days. Call 0320-324-3970"
        />
      </Head>
      <HillCrestResidencySchema />
      <VideoSchema
        title="Hill Crest Residency Virtual Tour | Luxury Apartments in Bahria Town Karachi"
        description="Take a virtual tour of Hill Crest Residency featuring luxury 2, 3 & 4 bedroom apartments with modern amenities in Bahria Town Karachi by Narkin's Builders."
        videoUrl="https://youtube.com/watch?v=TSiLOTW2s4g"
        thumbnailUrl="https://i.ytimg.com/vi/TSiLOTW2s4g/maxresdefault.jpg"
        uploadDate="2024-01-15"
        duration="PT3M45S"
        pageUrl="https://www.narkinsbuilders.com/hill-crest-residency"
      />
      <Navigation />
      <Lightbox />
      <div className="bg-white pt-[6rem]">
        <>
          <div className="px-4 bg-neutral-50 relative md:xl:px-0 w-full h-auto max-w-7xl z-index-0 bg-transparent mx-auto my-8 rounded-xl overflow-hidden -md:lg:rounded-none">
            <VideoPlayer
              src="/media/hcr/videos/hillcrest.mp4"
              poster={
                "/media/hcr/exterior/hill-crest-residency-exterior-view-bahria-town-karachi.webp"
              }
            />
          </div>
          <div className="relative isolate overflow-hidden py-20 pt-5 sm:py-[28px]">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-4xl tracking-tight text-black sm:text-7xl">
                  Hill Crest Residency
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-800">
                  Discover Hill Crest Residency, a masterpiece of modern living
                  located just moments from the main gate of Bahria Town Karachi
                  on Jinnah Avenue. We offer a luxurious lifestyle where every
                  detail is crafted for your comfort.
                  <br />
                  <br />
                  Explore our exquisite 2, 3, and 4-bedroom apartments for sale
                  in Bahria Town Karachi. Each residence features a spacious
                  lounge, elegant dining area, and stunning panoramic views.
                  Find the perfect home you've always dreamed of for your
                  family's future.
                </p>
              </div>
            </div>
          </div>
        </>
        <section className="bg-black py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Heading and Subheading */}
            <div className="text-center mb-12">
              <h2 className="text-4xl tracking-tight text-white sm:text-5xl">
                Apartment Plans
              </h2>
              <p className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">
                Find the perfect 2, 3, or 4-bedroom apartment in Bahria Town
                Karachi. Explore our floor plans and find a home that fits your
                lifestyle.
              </p>
            </div>
            <Tabs defaultValue={categories[0]} className="w-full mt-10">
              {/* Tabs List */}
              <TabsList className="flex space-x-1 gap-2 py-2 mb-5 border-b-neutral-900 rounded-xl bg-neutral-900/20">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="w-full rounded-lg py-2.5 text-sm leading-5 data-[state=active]:bg-neutral-400 data-[state=active]:text-neutral-700 data-[state=active]:shadow text-neutral-100 hover:bg-white/[0.12] hover:text-white transition-all duration-300"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tabs Content */}
              {cards.map((items, idx) => (
                <TabsContent key={idx} value={categories[idx]}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid mt-10 overflow-hidden min-h-[25rem] overflow-y-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {items.map((item, index) => (
                      <motion.div
                        key={index}
                        // whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="group"
                      >
                        <Card
                          onClick={() =>
                            openLightbox({ src: item.image, title: item.title })
                          }
                          className="bg-neutral-900 rounded-lg overflow-hidden cursor-pointer border border-neutral-800 hover:border-neutral-400 transition-all duration-300"
                        >
                          <CardHeader className="relative">
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={500}
                              height={300}
                              className="w-full h-auto rounded-t-lg"
                              loading={idx === 0 ? "eager" : "lazy"}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                              <MagnifyingGlassCircleIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <h1 className="text-xl text-white">{item.title}</h1>
                            <p className="text-sm mt-2 text-neutral-300">
                              Size: {item.size}, Location: {item.location}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        <section className="bg-white py-20">
          <Amenities />
        </section>
        <section className="bg-white px-5 mx-auto py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Gallery Heading (Optional) */}
            <div className="text-center mb-12">
              <h2 className="text-4xl tracking-tight text-black sm:text-5xl">
                Gallery
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Explore the stunning visuals of Hill Crest Residency.
              </p>
            </div>

            {/* Masonry Grid Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages.map((src, index) => (
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

            {/* Map Section (Unchanged) */}
            <div className="mt-16">
              <Map map="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.871134778674!2d67.3134228!3d25.0044944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34b0d0e2f0313%3A0x82f9da3499b223b1!2sHill%20Crest%20Residency!5e0!3m2!1sen!2s!4v1714296481726!5m2!1sen!2s" />
            </div>
          </div>
        </section>

        <section className="bg-white border-t px-5 lg:px-8 py-20">
          <Testimonials testimonials={testimonials} />
        </section>
        <section className="bg-white py-20 border-b border">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Heading */}
            <div className="text-center mb-12">
              <h2 className="text-4xl tracking-tight text-black sm:text-5xl">
                What Social Media is Saying
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                See what people are saying about Hill Crest Residency on YouTube
                and Facebook.
              </p>
            </div>

            {/* Modern Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
              {youtubeVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group relative"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-gray-900 shadow-2xl ring-1 ring-gray-900/10 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                    <div className="relative w-full h-[200px] lg:h-[280px]">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&showinfo=0&color=white&theme=dark&autoplay=0`}
                        title={video.title}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-2xl"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Video details */}
                  <div className="p-6 lg:p-8">
                    <h3 className="text-lg lg:text-xl text-gray-900 group-hover:text-primary transition-colors duration-200">
                      {video.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <BlogsSection posts={posts} />
      </div>
      <Footer map="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.887654842134!2d67.31088117394069!3d25.003933139504262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34b0d0e2f0313%3A0x82f9da3499b223b1!2sHill%20Crest%20Residency!5e0!3m2!1sen!2s!4v1751481865917!5m2!1sen!2s" />
    </main>
  )
}
// CHANGED: Transform MDX data to match BlogsSection expected format
export const getStaticProps: GetStaticProps = async () => {
  try {
    // Get latest 3 Hill Crest Residency related blog posts from MDX
    const mdxPosts = getAllPostsServer("hcr").slice(0, 3)

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
