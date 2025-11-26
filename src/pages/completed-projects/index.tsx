import Navigation from "@/components/layout/navigation/navigation"
import { Tab } from "@headlessui/react"
import { MagnifyingGlassCircleIcon } from "@heroicons/react/20/solid"
import dynamic from "next/dynamic"
import Image from "next/image"
import Footer from "@/components/layout/footer/footer"
import { useLightboxStore } from "@/zustand"
import Head from "next/head"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const categories = [
  "Palm Residency",
  "AL Arz Terrace",
  "AL Arz Homes",
  "Classic Heights",
]
const maps = [
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2757.942943695933!2d67.0382979!3d24.840475599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33dd1da9b421f%3A0xed57a16e28104a84!2sPalm%20Residency%2C%20McNeil%20Rd%2C%20Frere%20Town%2C%20Karachi%2C%20Pakistan!5e1!3m2!1sen!2sus!4v1742636653877!5m2!1sen!2sus",
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4967.554989137014!2d67.03420337649223!3d24.876732177918772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e5c5fea0781%3A0x49dd2ea8b9422ee6!2sAl-Arz%20Terrace!5e1!3m2!1sen!2s!4v1714414177304!5m2!1sen!2s",
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4967.446745804674!2d67.05358048911405!3d24.879424520977317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f0057261ced%3A0x94c02ee6dcf3d3c8!2sAl%20Arz%20Homes!5e1!3m2!1sen!2s!4v1714414221044!5m2!1sen!2s",
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4965.124852519145!2d67.03464437649365!3d24.937111577879445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f86e9eb2f4d%3A0x137af69775b7af4c!2sClassic%20Homes!5e1!3m2!1sen!2s!4v1714414259043!5m2!1sen!2s",
]
const cards = [
  [
    // Palm Residency image
    "/media/completed-projects/palm-residency-completed-project-frere-town-karachi.webp",
  ],
  [
    // AL Arz Terrace image
    "/media/completed-projects/al-arz-terrace-completed-project-narkins-builders-karachi.webp",
  ],
  [
    // AL Arz Homes image
    "/media/completed-projects/al-arz-homes-completed-project-narkins-builders-karachi.webp",
  ],
  [
    // Classic Heigths image
    "/media/completed-projects/classic-heights-completed-project-sharfabad-karachi.webp",
  ],
]

const Lightbox = dynamic(
  () => import("@/components/features/lightbox/lightbox"),
  { ssr: false }
)

export default function NarkinsBoutiqueResidency() {
  const openLightbox = useLightboxStore((state) => state.openLightbox)

  return (
    <main>
      <Head>
        <title>
          Completed Projects | Narkin's Builders Portfolio in Karachi
        </title>
        <meta
          name="description"
          content="Explore Narkin's Builders completed projects in Karachi. View our portfolio of residential developments, apartments, and construction achievements across the city."
        />
        <meta
          name="keywords"
          content="Narkin's Builders completed projects, Karachi construction portfolio, residential developments, apartment buildings, construction achievements"
        />
        <meta name="author" content="Narkin's Builders" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Completed Projects | Narkin's Builders Portfolio in Karachi"
        />
        <meta
          property="og:description"
          content="Explore Narkin's Builders completed projects in Karachi. View our portfolio of residential developments and construction achievements."
        />
        <meta
          property="og:url"
          content="https://www.narkinsbuilders.com/completed-projects"
        />
        <meta
          property="og:image"
          content="https://www.narkinsbuilders.com/media/common/logos/narkins-builders-logo-30-years-experience.webp"
        />
        <meta property="og:site_name" content="Narkin's Builders" />

        {/* Instagram/Social Media Optimization */}
        <meta name="instagram:account" content="@narkinsbuilders" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Narkin's Builders Completed Projects Portfolio"
        />

        <link
          rel="canonical"
          href="https://www.narkinsbuilders.com/completed-projects"
        />
      </Head>
      <Navigation />
      <Lightbox />
      <section className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-primary"></div>
              <span className="text-primary text-sm uppercase tracking-wider">
                Our Portfolio
              </span>
              <div className="w-8 h-0.5 bg-primary"></div>
            </div>
            <h2 className="text-3xl text-gray-900 sm:text-4xl mb-4">
              Completed Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our successful developments across Karachi, each
              representing our commitment to quality and excellence.
            </p>
          </div>

          <Tab.Group>
            {/* Enhanced Tab Navigation */}
            <Tab.List className="flex flex-wrap justify-center gap-2 mb-12 bg-white p-2 rounded-2xl shadow-lg max-w-4xl mx-auto overflow-x-auto">
              {categories.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      "px-4 py-3 rounded-xl text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50",
                      selected
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>

            {/* Enhanced Tab Content */}
            <Tab.Panels>
              {cards.map((items, idx) => (
                <Tab.Panel key={idx}>
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto">
                    {/* Project Image Section */}
                    <div className="relative">
                      {items.map((item, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video overflow-hidden">
                            <Image
                              src={item}
                              alt={`${categories[idx]} project view`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              priority={index === 0}
                              width={800}
                              height={450}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          {/* Image Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <div
                              onClick={() => openLightbox({ src: item })}
                              className="opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30"
                            >
                              <MagnifyingGlassCircleIcon className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          {/* Project Badge */}
                          <div className="absolute top-4 left-4">
                            <div className="bg-primary text-white px-4 py-2 rounded-lg text-sm shadow-lg">
                              {categories[idx]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Project Details Section */}
                    <div className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Project Info */}
                        <div>
                          <h3 className="text-2xl text-gray-900 mb-4">
                            {categories[idx]}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-gray-600">
                                Status:{" "}
                                <span className=" text-gray-900">
                                  Completed
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-gray-600">
                                Type:{" "}
                                <span className=" text-gray-900">
                                  Residential Development
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-gray-600">
                                Location:{" "}
                                <span className=" text-gray-900">
                                  Karachi, Pakistan
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Location Map */}
                        <div>
                          <h4 className="text-lg text-gray-900 mb-4">
                            Project Location
                          </h4>
                          <div className="rounded-xl overflow-hidden shadow-md">
                            <iframe
                              src={maps[idx]}
                              className="w-full h-64"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title={`${categories[idx]} location map`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
      <Footer map="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.887654842134!2d67.31088117394069!3d25.003933139504262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34b0d0e2f0313%3A0x82f9da3499b223b1!2sHill%20Crest%20Residency!5e0!3m2!1sen!2s!4v1751481865917!5m2!1sen!2s" />
    </main>
  )
}
