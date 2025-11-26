import Navigation from "@/components/layout/navigation/navigation"
import AdsCampaign from "@/components/features/ads-campaign/ads-campaign"
import Footer from "@/components/layout/footer/footer"
import Head from "next/head"

export default function AdsLandingPage() {
  return (
    <main>
      <Head>
        <title>Book Hill Crest Residency Apartments | Narkin's Builders</title>
        <meta
          name="description"
          content="Book your luxury apartment at Hill Crest Residency in Bahria Town Karachi. 2, 3 & 4 bedroom apartments with premium amenities."
        />
        <link
          rel="canonical"
          href="https://www.narkinsbuilders.com/book-hill-crest-residency-apartments"
        />
      </Head>
      <Navigation />
      <div className="bg-white pt-[6rem]">
        <div className="relative isolate overflow-hidden py-20 pt-5 sm:py-[28px]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AdsCampaign
              residency="Hill Crest Residency"
              onlyForm={false}
              image={
                "/media/hcr/exterior/hill-crest-residency-exterior-view-bahria-town-karachi.webp"
              }
              imageWidth={800}
              imageHeight={1422}
              mapUrl="https://www.google.com/maps/place/Hill+Crest+Residency/@25.0039331,67.3108812,17z/data=!3m1!4b1!4m6!3m5!1s0x3eb34b0d0e2f0313:0x82f9da3499b223b1!8m2!3d25.0039331!4d67.3134561!16s%2Fg%2F11pzq0ybkk"
              headline={"2, 3 & 4 Bedroom Luxury Apartments "}
              features={[
                "Main Jinnah Avenue, Less than a minute drive from main gate",
                "Smart Apartments",
                "High speed lifts, Reception area & standby generators",
                "Gym, community hall, steam bath",
                "Inhouse Prayer Area",
              ]}
            />
          </div>
        </div>
      </div>
      <Footer map="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.887654842134!2d67.31088117394069!3d25.003933139504262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34b0d0e2f0313%3A0x82f9da3499b223b1!2sHill%20Crest%20Residency!5e0!3m2!1sen!2s!4v1751481865917!5m2!1sen!2s" />
    </main>
  )
}
