import { NextApiRequest, NextApiResponse } from "next"
import { getAllPostsServer } from "../../lib/blog-server"
import { generateBlogUrlFromDateAndSlug } from "../../lib/blog"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.narkinsbuilders.com"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const posts = await getAllPostsServer()

    const rssItemsXml = posts
      .slice(0, 20) // Latest 20 posts
      .map((post) => {
        const pubDate = new Date(post.date).toUTCString()
        const imageUrl = post.image.startsWith("http")
          ? post.image
          : `${SITE_URL}${post.image}`
        const blogUrl = generateBlogUrlFromDateAndSlug(post.date, post.slug)

        return `
   <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${SITE_URL}${blogUrl}</link>
    <guid isPermaLink="true">${SITE_URL}${blogUrl}</guid>
    <description><![CDATA[${post.excerpt || `Expert real estate insights from Narkin's Builders - ${post.title}`}]]></description>
    <pubDate>${pubDate}</pubDate>
    <author>admin@narkinsbuilders.com (Narkin's Builders)</author>
    <category>Real Estate</category>
    <enclosure url="${imageUrl}" type="image/webp" />
    <content:encoded><![CDATA[
     <img src="${imageUrl}" alt="${post.title}" style="max-width: 100%; height: auto;" />
     <p>${post.excerpt || `Expert real estate insights from Narkin's Builders about ${post.title}.`}</p>
     <p><a href="${SITE_URL}${blogUrl}">Read the full article on Narkin's Builders website</a></p>
    ]]></content:encoded>
   </item>`
      })
      .join("")

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
   xmlns:content="http://purl.org/rss/1.0/modules/content/"
   xmlns:atom="http://www.w3.org/2005/Atom"
   xmlns:media="http://search.yahoo.com/mrss/">
 <channel>
  <title>Narkin's Builders - Real Estate Blog</title>
  <link>${SITE_URL}</link>
  <description>Expert insights on real estate investment, luxury apartments, and property development in Bahria Town Karachi from Narkin's Builders.</description>
  <language>en-us</language>
  <managingEditor>admin@narkinsbuilders.com (Narkin's Builders)</managingEditor>
  <webMaster>admin@narkinsbuilders.com (Narkin's Builders)</webMaster>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <pubDate>${new Date().toUTCString()}</pubDate>
  <ttl>60</ttl>
  <image>
   <url>${SITE_URL}/media/common/logos/narkins-builders-logo-30-years-experience.webp</url>
   <title>Narkin's Builders</title>
   <link>${SITE_URL}</link>
   <description>Premium real estate developer in Bahria Town Karachi</description>
   <width>400</width>
   <height>400</height>
  </image>
  <atom:link href="${SITE_URL}/api/rss.xml" rel="self" type="application/rss+xml" />
  <category>Real Estate</category>
  <category>Property Investment</category>
  <category>Luxury Apartments</category>
  <category>Bahria Town Karachi</category>
  ${rssItemsXml}
 </channel>
</rss>`

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8")
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate"
    )
    res.status(200).send(rssXml)
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    res.status(500).json({ error: "Failed to generate RSS feed" })
  }
}
