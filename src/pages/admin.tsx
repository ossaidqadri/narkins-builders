import { GetServerSideProps } from "next"
import Head from "next/head"

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin - Narkin's Builders</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.narkinsbuilders.com/admin" />
      </Head>
      <div>Redirecting to admin...</div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const protocol = req.headers["x-forwarded-proto"] || "http"
  const host = req.headers.host
  const isLocalhost = host?.includes("localhost")

  // Check if we're in development mode (TinaCMS dev server running)
  const isDev = process.env.NODE_ENV === "development"

  let destination
  if (isLocalhost && isDev) {
    destination = "http://localhost:4001/admin/index.html"
  } else {
    destination = "/admin/index.html"
  }

  return {
    redirect: {
      destination,
      permanent: false,
    },
  }
}
