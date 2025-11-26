import { useEffect } from "react"

const FacebookPageEmbed = () => {
  useEffect(() => {
    // Load Facebook SDK script dynamically
    const script = document.createElement("script")
    script.async = true
    script.defer = true
    script.crossOrigin = "anonymous"
    script.src =
      "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0"
    document.body.appendChild(script)
  }, [])

  return (
    <div className="flex justify-center">
      <div
        className="fb-page"
        data-href="https://www.facebook.com/TheHillCrestResidency/"
        data-tabs="timeline"
        data-width="500"
        data-height="600"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote
          cite="https://www.facebook.com/TheHillCrestResidency/"
          className="fb-xfbml-parse-ignore"
        >
          <a href="https://www.facebook.com/TheHillCrestResidency/">
            The Hill Crest Residency
          </a>
        </blockquote>
      </div>
    </div>
  )
}

export default FacebookPageEmbed
