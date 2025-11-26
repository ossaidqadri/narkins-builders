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
import { NarkinsBoutiqueResidencySchema } from "@/components/common/schema/NarkinsBoutiqueResidencySchema"
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

const categories = ["2 Bed", "3 Bed", "4 Bed", "Sky Villa Duplex"]
const cards = [
  [
    {
      title: "2 Bed Gold",
      size: "1547 Square Feet",
      location: "Heritage Club & Danzoo Safari View",
      image:
        "/media/nbr/floor-plans/narkins-boutique-residency-2-bedroom-gold-1547-sqft-heritage-view.webp",
    },
  ],
  [
    {
      title: "3 Bed Diamond Corner",
      size: "2184 Square Feet",
      location: "Heritage Club & Theme Park View",
      image:
        "/media/nbr/floor-plans/narkins-boutique-residency-3-bedroom-diamond-corner-2184-sqft.webp",
    },
    {
      title: "3 Bed Diamond-A",
      size: "2121 Square Feet",
      location: "Jinnah & Theme Park View",
      image:
        "/media/nbr/floor-plans/narkins-boutique-residency-3-bedroom-diamond-a-2121-sqft.webp",
    },
  ],
  [
    {
      title: "4 Bed Platinum A-1 Corner",
      size: "2670 Square Feet",
      location: "Jinnah & Danzoo Safari View",
      image:
        "/media/nbr/floor-plans/narkins-boutique-residency-4-bedroom-platinum-a1-corner-2670-sqft.webp",
    },
    {
      title: "4 Bed Platinum A-1 Boulevard",
      size: "2486 Square Feet",
      location: "Jinnah & Boulevard View",
      image:
        "/media/nbr/floor-plans/narkins-boutique-residency-4-bedroom-platinum-a1-boulevard-2486-sqft.webp",
    },
    {
      title: "4 Bed Platinum-A",
      size: "2597 Feet",
      location: "Jinnah & Theme Park View",
      image:
        "/media/nbr/floor-plans/narkins-boutique-residency-4-bedroom-platinum-a-2597-sqft.webp",
    },
    // {
    //  title: "4 Bed Platinum A-1",
    //  size: "2486 Square Feet",
    //  location: "Jinnah & Theme Park View",
    //  image: "/images/narkins-boutique-residency-4-bedroom-platinum-a-2597-sqft.webp",
    // },
  ],
  [
    {
      title: "Platinium A-1 Corner 6 Bed",
      size: "5340 Square Feet",
      location: "Jinnah & Danzoo Safari View",
      image:
        "/media/nbr/floor-plans/narkins-boutique-residency-6-bedroom-platinum-a1-corner-updated-design.webp",
    },
    {
      title: "Platinum A-1 Boulevard 6 Bed",
      size: "4972 Square Feet",
      location: "Jinnah & Boulevard View",
      image: "/media/nbr/3d-renders/platinum-A1-boulevard-new-sky.webp",
    },
    {
      title: "Platinium A 6 Bed",
      size: "5194 Square Feet",
      location: "Jinnah & Theme Park View",
      image:
        "/media/nbr/floor-plans/narkins-boutique-residency-6-bedroom-platinum-a-updated-design.webp",
    },
    {
      title: "Diamond A 5 Bed",
      size: "4242 Square Feet",
      location: "Jinnah & Theme Park View",
      image:
        "/media/nbr/floor-plans/narkins-boutique-residency-5-bedroom-diamond-a-sky-villa-design.webp",
    },
    {
      title: "Diamond Corner 6 bed",
      size: "4968 Square Feet",
      location: "Heritage Club & Theme Park View",
      image: "/media/nbr/3d-renders/diamond-corner-new-sky.webp",
    },
    {
      title: "Gold 4 Bed",
      size: "3094 Square Feet",
      location: "Heritage Club & Danzoo Safari View",
      image:
        "/media/nbr/floor-plans/narkins-boutique-residency-2-bedroom-gold-updated-design.webp",
    },
  ],
]

const amenities = [
  {
    image:
      "/media/nbr/amenities/narkins-boutique-residency-gym-fitness-center.webp",
    name: "Gym",
    alt: "Narkin's Boutique Residency state-of-the-art gym and fitness center with modern equipment",
  },
  {
    image:
      "/media/nbr/amenities/narkins-boutique-residency-kids-play-area.webp",
    name: "Kids Area",
    alt: "Narkin's Boutique Residency dedicated kids play area and children's facilities",
  },
  {
    image:
      "/media/nbr/amenities/narkins-boutique-residency-steam-bath-wellness.webp",
    name: "Steam Bath",
    alt: "Narkin's Boutique Residency steam bath and wellness center for relaxation",
  },
  {
    image:
      "/media/nbr/amenities/narkins-boutique-residency-grand-reception-lobby.webp",
    name: "Grand Reception",
    alt: "Narkin's Boutique Residency grand reception and lobby area with luxury finishes",
  },
  {
    image:
      "/media/nbr/amenities/narkins-boutique-residency-snooker-recreation-room.webp",
    name: "Snooker",
    alt: "Narkin's Boutique Residency snooker and recreation room for residents",
  },
  {
    image:
      "/media/nbr/amenities/narkins-boutique-residency-high-speed-elevators.webp",
    name: "Elevators",
    alt: "Narkin's Boutique Residency high-speed elevators and lift facilities",
  },
  {
    image:
      "/media/nbr/amenities/narkins-boutique-residency-swimming-pool-indoor.webp",
    name: "Pool",
    alt: "Narkin's Boutique Residency indoor swimming pool facility for residents",
  },
  {
    image:
      "/media/nbr/amenities/narkins-boutique-residency-community-hall-seating.webp",
    name: "Community Hall",
    alt: "Narkin's Boutique Residency community hall with premium seating arrangements",
  },
  {
    image:
      "/media/nbr/amenities/narkins-boutique-residency-underground-parking-5-floors.webp",
    name: "5 Floors Parking",
    alt: "Narkin's Boutique Residency 5-floor underground car parking facility",
  },
]

const galleryImages = [
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-living-room-luxury.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-master-bedroom.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-kitchen-premium.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-bathroom-marble.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-balcony-heritage-view.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-dining-area.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-guest-room.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-powder-room.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-family-lounge.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-entrance-foyer.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-utility-area.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-walk-in-closet.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-study-room.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-storage-space.webp",
  "/media/nbr/apartment-interiors/narkins-boutique-residency-apartment-laundry-room.webp",
]

const youtubeVideos = [
  {
    id: "FmEHTzdjXEc",
    title: "Luxury Living at Hill Crest Residency | A Guided Tour",
    type: "youtube",
  },
  {
    id: "uzYVdqFHovs",
    title: "Hill Crest Residency: Modern Amenities and Stunning Views",
    type: "youtube",
  },
  {
    id: "n8PT4z9MdRA",
    title: "Why Choose Hill Crest Residency? | Customer Testimonials",
    type: "youtube",
  },
  {
    id: "DClpf8-xaS8",
    title: "Hill Crest Residency: Your Dream Home in Bahria Town Karachi",
    type: "youtube",
  },
  {
    id: "5uMTiRmZXBw",
    title:
      "Hill Crest Residency: A Closer Look at Our 2, 3 & 4 Bedroom Apartments",
    type: "youtube",
  },
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
] as const

const Amenities = () => {
  const [amenityIndex, setAmenityIndex] = useState(0)
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Heading and Subheading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl tracking-tight text-black sm:text-5xl">
          Amenities in {`Narkin's `} Boutique Residency
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Explore the top-notch amenities designed to enhance your living
          experience.
        </p>
      </div>

      {/* Amenities Grid */}
      <div className="max-w-7xl w-full mx-auto">
        <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
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
          dataSource={amenities}
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
          Narkin's Boutique Residency - Pre-Launch Pricing | Luxury Apartments
          Bahria Town
        </title>
        <meta
          name="description"
          content="✓ Pre-Launch Exclusive ✓ 20-Floor Luxury Tower ✓ 2/3/4 BHK & Sky Villas ✓ Heritage Commercial Location ✓ Easy Installments. Lock today's price for tomorrow's delivery. Indoor Pool, Gym & 5-Floor Parking. Call 0320-324-3970"
        />
        <meta
          name="keywords"
          content="Narkin's Boutique Residency apartments, pre-launch apartments Bahria Town, luxury apartments Heritage Commercial, apartments on installments Bahria Town, sky villa duplex Bahria Town, 2 bedroom apartments Bahria Town, 3 bedroom apartments Bahria Town, 4 bedroom apartments Bahria Town, apartments with gym Bahria Town, theme park view apartments Bahria Town, best apartments in Bahria Town Karachi"
        />
        <meta name="author" content="Narkin's Builders" />

        <link
          rel="canonical"
          href="https://www.narkinsbuilders.com/narkins-boutique-residency"
        />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Narkin's Boutique Residency - Pre-Launch Pricing | Luxury Apartments Bahria Town"
        />
        <meta
          property="og:description"
          content="✓ Pre-Launch Exclusive ✓ 20-Floor Luxury Tower ✓ 2/3/4 BHK & Sky Villas ✓ Heritage Commercial ✓ Easy Installments. Lock today's price. Indoor Pool, Gym & 5-Floor Parking. Call 0320-324-3970"
        />
        <meta
          property="og:url"
          content="https://www.narkinsbuilders.com/narkins-boutique-residency"
        />
        <meta
          property="og:image"
          content="https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo-30-years-experience.webp"
        />
        <meta property="og:site_name" content="Narkin's Boutique Residency" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Narkin's Boutique Residency - Pre-Launch Pricing | Luxury Apartments Bahria Town"
        />
        <meta
          name="twitter:description"
          content="✓ Pre-Launch Exclusive ✓ 20-Floor Luxury Tower ✓ 2/3/4 BHK & Sky Villas ✓ Easy Installments. Lock today's price. Call 0320-324-3970"
        />
      </Head>
      <NarkinsBoutiqueResidencySchema />
      <VideoSchema
        title="Narkin's Boutique Residency Luxury Tour | Premium Apartments in Heritage Commercial Bahria Town"
        description="Explore Narkin's Boutique Residency featuring luxury 2-6 bedroom apartments with world-class amenities in Heritage Commercial, Bahria Town Karachi."
        videoUrl="https://youtube.com/watch?v=FmEHTzdjXEc"
        thumbnailUrl="https://i.ytimg.com/vi/FmEHTzdjXEc/maxresdefault.jpg"
        uploadDate="2024-01-20"
        duration="PT4M15S"
        pageUrl="https://www.narkinsbuilders.com/narkins-boutique-residency"
      />
      <Navigation />
      <Lightbox />
      <div className="bg-white pt-[6rem]">
        <>
          <div className="px-4 bg-neutral-50 relative md:xl:px-0 w-full h-auto max-w-7xl z-index-0 bg-transparent mx-auto my-8 rounded-xl overflow-hidden -md:lg:rounded-none">
            <VideoPlayer
              src="/media/nbr/videos/nbr.mp4"
              poster={"/nbr_video_poster.webp"}
            />
          </div>
          <div className="relative isolate overflow-hidden py-20 pt-5 sm:py-[28px]">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-4xl tracking-tight text-black sm:text-7xl">
                  {"Narkin's "} Boutique Residency
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-800">
                  Welcome to {`Narkin's `}Boutique Residency, where luxury meets
                  bespoke design in the heart of Bahria Town Karachi's Heritage
                  Commercial area. Crafted by "Talent & Taste," our premium
                  high-rise apartments redefine upscale living with their
                  exquisite attention to detail. Nestled in the esteemed
                  Heritage Commercial area, {`Narkin's`} Boutique Residency
                  offers residents unparalleled access to a wealth of amenities
                  and attractions. From exclusive luxury farmhouses and the
                  prestigious Heritage Club to the convenience of Imtiaz Mega,
                  shopping malls, and a bustling food street, everything you
                  desire is just a walk away. Additionally, the 24/7 Shop Stop &
                  PSO ensures your daily needs are effortlessly met.
                  <br />
                  <br />
                  With ground + 20 floors, {`Narkin's`} Boutique Residency
                  offers a premier selection of 2, 3, and 4-bedroom luxury
                  apartments for sale in Bahria Town Karachi, each boasting
                  panoramic views of Bahria Town Karachi. Experience the epitome
                  of sophistication as you unwind in your designer
                  Apartment.Adding to its uniqueness, {`Narkin's`} introduces
                  Sky Villa Duplex penthouses—double-story luxury residences
                  with private terraces, expansive layouts, and unmatched
                  privacy, perfect for those seeking a villa experience in the
                  sky.
                  <br />
                  <br />
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
                Apartment Floor Plans
              </h2>
              <p className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">
                Explore our 2, 3, and 4-bedroom luxury apartments for sale in
                Bahria Town Karachi. Find the perfect floor plan for your needs.
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
              {cards.map((items, idx) => {
                const isSkyVillaTab = idx === 3 // Sky Villa Duplex tab
                const ContainerComponent = isSkyVillaTab ? "div" : motion.div
                const ItemComponent = isSkyVillaTab ? "div" : motion.div

                return (
                  <TabsContent key={idx} value={categories[idx]}>
                    <ContainerComponent
                      {...(!isSkyVillaTab && {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.5 },
                      })}
                      className={`grid mt-10 overflow-hidden min-h-[25rem] overflow-y-auto gap-6 ${
                        items.length > 4
                          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
                          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      }`}
                      style={
                        isSkyVillaTab
                          ? {
                              WebkitTransform: "translateZ(0)",
                              transform: "translateZ(0)",
                              WebkitBackfaceVisibility: "hidden",
                              backfaceVisibility: "hidden",
                              contain: "layout style paint",
                            }
                          : undefined
                      }
                    >
                      {items.map((item, index) => (
                        <ItemComponent
                          key={index}
                          {...(!isSkyVillaTab && {
                            initial:
                              items.length > 4 ? false : { opacity: 0, y: 20 },
                            animate:
                              items.length > 4 ? {} : { opacity: 1, y: 0 },
                            transition:
                              items.length > 4
                                ? {}
                                : { duration: 0.3, delay: index * 0.1 },
                          })}
                          className="group"
                          style={
                            isSkyVillaTab
                              ? {
                                  WebkitTransform: "translateZ(0)",
                                  transform: "translateZ(0)",
                                  WebkitBackfaceVisibility: "hidden",
                                  backfaceVisibility: "hidden",
                                }
                              : undefined
                          }
                        >
                          <Card
                            onClick={() =>
                              openLightbox({
                                src: item.image,
                                title: item.title,
                              })
                            }
                            className="bg-neutral-900 rounded-lg overflow-hidden cursor-pointer border border-neutral-800 hover:border-neutral-400 transition-all duration-300"
                          >
                            <CardHeader className="relative">
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={isSkyVillaTab ? 350 : 400}
                                height={isSkyVillaTab ? 220 : 250}
                                className="w-full h-auto rounded-t-lg"
                                loading={
                                  idx === 0 && index < 2
                                    ? "eager"
                                    : index > 3
                                      ? "lazy"
                                      : "lazy"
                                }
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                quality={idx === 3 ? 70 : 85}
                                priority={false}
                                style={
                                  isSkyVillaTab
                                    ? {
                                        WebkitTransform: "translateZ(0)",
                                        transform: "translateZ(0)",
                                        imageRendering: "auto",
                                      }
                                    : undefined
                                }
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <MagnifyingGlassCircleIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                              </div>
                            </CardHeader>
                            <CardContent className="p-4">
                              <h1 className="text-xl text-white">
                                {item.title}
                              </h1>
                              <p className="text-sm mt-2 text-neutral-300">
                                Size: {item.size}, Location: {item.location}
                              </p>
                            </CardContent>
                          </Card>
                        </ItemComponent>
                      ))}
                    </ContainerComponent>
                  </TabsContent>
                )
              })}
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
                Explore the stunning visuals of Narkin's Boutique Residency.
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
    // Get latest 3 Narkins Boutique Residency related blog posts from MDX
    const mdxPosts = getAllPostsServer("nbr").slice(0, 3)

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
