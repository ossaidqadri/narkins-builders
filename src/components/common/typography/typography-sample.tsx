// Typography Sample Component - Demonstrates new font system
import React from "react"

const TypographySample = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Hero Section Typography */}
      <section className="text-center space-y-4">
        <h1>Narkin's Builders</h1>
        <p>
          Premium Apartments in Bahria Town Karachi - 30+ Years of Excellence
        </p>
      </section>

      {/* Content Typography Hierarchy */}
      <section className="space-y-6">
        <h2>Luxury Living Redefined</h2>

        <p>
          Experience the pinnacle of luxury living with our meticulously crafted
          apartments. Each residence features premium finishes, modern
          amenities, and stunning views of Bahria Town's pristine landscape.
        </p>

        <h3>Hill Crest Residency</h3>

        <p>
          Our flagship project combines contemporary design with traditional
          craftsmanship, offering 2, 3, and 4-bedroom apartments with
          world-class amenities.
        </p>

        {/* Feature List */}
        <ul>
          <li className="list-disc">Premium imported fixtures and fittings</li>
          <li className="list-disc">24/7 security and concierge services</li>
          <li className="list-disc">State-of-the-art fitness center and spa</li>
          <li className="list-disc">Rooftop gardens and recreational areas</li>
        </ul>

        {/* Call to Action */}
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
          <h4>Ready to Invest?</h4>
          <p>
            Contact our investment specialists today to explore exclusive
            opportunities in Bahria Town Karachi's most prestigious residential
            development.
          </p>
        </div>
      </section>

      {/* Typography Scale Demo */}
      <section className="space-y-4 border-t pt-8">
        <h5>Typography Scale</h5>

        <div className="space-y-3">
          <h1>Heading 1 - Playfair Display</h1>
          <h2>Heading 2 - Playfair Display</h2>
          <h3>Heading 3 - Playfair Display</h3>
          <h4>Heading 4 - Playfair Display</h4>
          <h5>Heading 5 - Inter</h5>
          <h6>Heading 6 - Inter</h6>

          <p>Body text - Inter Regular</p>
          <p>Body text - Inter Medium</p>
          <p>Small text - Inter Regular</p>
          <p>Caption - Inter Regular</p>
        </div>
      </section>
    </div>
  )
}

export default TypographySample
