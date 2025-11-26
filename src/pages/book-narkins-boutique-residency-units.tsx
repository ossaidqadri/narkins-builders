import Navigation from "@/components/layout/navigation/navigation"
import AdsCampaign from "@/components/features/ads-campaign/ads-campaign"
import Footer from "@/components/layout/footer/footer"
import Head from "next/head"

export default function AdsLandingPage() {
  return (
    <main>
      <Head>
        <title>
          Book Narkin's Boutique Residency Units | Narkin's Builders
        </title>
        <meta
          name="description"
          content="Book your luxury unit at Narkin's Boutique Residency in Bahria Town Karachi. Premium apartments with modern amenities and elegant design."
        />
        <link
          rel="canonical"
          href="https://www.narkinsbuilders.com/book-narkins-boutique-residency-units"
        />
      </Head>
      <Navigation />
      <div className="bg-white pt-[6rem]">
        <div className="relative isolate overflow-hidden py-20 pt-5 sm:py-[28px]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AdsCampaign
              residency="Narkin's Boutique Residency"
              onlyForm={false}
              image={
                "/media/nbr/exterior/narkins-boutique-residency-navigation-thumbnail.webp"
              }
              imageWidth={550}
              imageHeight={750}
              mapUrl="https://www.google.com/maps/place/Narkin's+Boutique+Residency/@25.0148945,67.3165014,17z/data=!3m1!4b1!4m6!3m5!1s0x3eb34bad638fbbb1:0x4aa67ba370e4667b!8m2!3d25.0148897!4d67.3190763!16s%2Fg%2F11rr24w7nc?entry=ttu&g_ep=EgoyMDI1MDgyNy4wIKXMDSoASAFQAw%3D%3D"
              headline={"2, 3 & 4 Bedroom Luxury Apartments"}
              features={[
                "3 mins from the main gate",
                "Construction on full swing",
                "Smart Apartment",
                "Capsule lifts, Reception area & Standby generators",
                "Gym, Community hall, Indoor swimming pool",
                "5 Floor car parking",
                "Inhouse prayer area",
              ]}
            />
          </div>
        </div>
      </div>
      <Footer map="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.887654842134!2d67.31088117394069!3d25.003933139504262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34b0d0e2f0313%3A0x82f9da3499b223b1!2sHill%20Crest%20Residency!5e0!3m2!1sen!2s!4v1751481865917!5m2!1sen!2s" />
    </main>
  )
}
