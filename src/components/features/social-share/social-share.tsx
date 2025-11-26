// src/components/features/social-share/social-share.tsx
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa"
import { motion } from "framer-motion"

interface SocialShareProps {
  url: string
  title: string
}

const SocialShare = ({ url, title }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-blue-600 hover:text-white",
      bgColor: "bg-blue-50",
    },
    {
      name: "Twitter",
      icon: <FaTwitter size={20} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-sky-500 hover:text-white",
      bgColor: "bg-sky-50",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={20} />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: "hover:bg-blue-700 hover:text-white",
      bgColor: "bg-blue-50",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={20} />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-green-500 hover:text-white",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
      <span className=" text-gray-900 text-lg">Share this post:</span>
      <div className="flex items-center gap-3">
        {socialLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`
       flex items-center justify-center w-12 h-12 rounded-full
       ${link.bgColor} ${link.color}
       text-gray-600 border border-gray-200
       transition-all duration-300 ease-in-out
       shadow-sm hover:shadow-md
       group
      `}
            aria-label={`Share on ${link.name}`}
          >
            <div className="transition-transform duration-200 group-hover:scale-110">
              {link.icon}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}

export default SocialShare
