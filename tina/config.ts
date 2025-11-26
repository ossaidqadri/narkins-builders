import { defineConfig } from "tinacms"

export default defineConfig({
  branch: "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  ui: {
    title: "OtherDev CMS Solutions",
    welcomeMessage:
      "Welcome to OtherDev CMS Solutions!\n\nThis is your dashboard for editing and creating content. Select a collection on the left to begin.",
  },
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ["eng"],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "blog",
        label: "Blog Posts",
        path: "content/blogs",
        format: "mdx",
        ui: {
          filename: {
            readonly: true,
            slugify: (values) => {
              return `${values?.title
                ?.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")}`
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
            searchable: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            required: true,
            searchable: true,
            ui: {
              component: "textarea",
              description:
                "Brief description of the blog post for SEO and previews",
            },
          },
          {
            type: "datetime",
            name: "date",
            label: "Publication Date",
            required: true,
          },
          {
            type: "image",
            name: "image",
            label: "Featured Image",
            required: true,
            description: "Main image for the blog post",
          },
          {
            type: "string",
            name: "readTime",
            label: "Read Time",
            required: true,
            description: 'Estimated read time (e.g., "8 min read")',
          },
          {
            type: "datetime",
            name: "lastModified",
            label: "Last Modified",
            required: true,
          },
          {
            type: "string",
            name: "season",
            label: "Season",
            required: true,
            options: [
              { value: "peak", label: "Peak Season" },
              { value: "off-peak", label: "Off-Peak Season" },
              { value: "moderate", label: "Moderate Season" },
            ],
          },
          {
            type: "string",
            name: "priority",
            label: "Priority",
            required: true,
            options: [
              { value: "high", label: "High Priority" },
              { value: "medium", label: "Medium Priority" },
              { value: "low", label: "Low Priority" },
            ],
          },
          {
            type: "boolean",
            name: "automatedUpdate",
            label: "Automated Update",
            description: "Whether this post receives automated updates",
          },
          {
            type: "string",
            name: "marketTiming",
            label: "Market Timing",
            required: true,
            ui: {
              component: "textarea",
              description: "Market timing description for this post",
            },
          },
          {
            type: "boolean",
            name: "dateFixed",
            label: "Date Fixed",
            description: "Whether the publication date is fixed",
          },
          {
            type: "string",
            name: "keywords",
            label: "SEO Keywords",
            required: true,
            searchable: true,
            ui: {
              component: "textarea",
              description: "Comma-separated keywords for SEO",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,
            searchable: true,
            templates: [
              {
                name: "FAQ",
                label: "FAQ Section",
                fields: [
                  {
                    name: "staticFaqs",
                    label: "FAQ Data",
                    type: "string",
                    options: [
                      {
                        value: "firstTimeBuyerFAQs",
                        label: "First Time Buyer FAQs",
                      },
                      {
                        value: "investmentGuideFAQs",
                        label: "Investment Guide FAQs",
                      },
                      { value: "twoBedroomFAQs", label: "Two Bedroom FAQs" },
                      {
                        value: "luxuryApartmentsFAQs",
                        label: "Luxury Apartments FAQs",
                      },
                      {
                        value: "generalRealEstateFAQs",
                        label: "General Real Estate FAQs",
                      },
                      {
                        value: "hillCrestFAQs",
                        label: "Hill Crest Residency FAQs",
                      },
                      {
                        value: "boutiqueResidencyFAQs",
                        label: "Boutique Residency FAQs",
                      },
                      {
                        value: "apartmentSaleFAQs",
                        label: "Apartment Sale FAQs",
                      },
                    ],
                  },
                  {
                    name: "pageUrl",
                    label: "Page URL",
                    type: "string",
                    description: "URL of the current page for FAQ context",
                  },
                  {
                    name: "contextType",
                    label: "Context Type",
                    type: "string",
                    options: [
                      { value: "property", label: "Property" },
                      { value: "investment", label: "Investment" },
                      { value: "general", label: "General" },
                    ],
                  },
                  {
                    name: "title",
                    label: "Title",
                    type: "string",
                    description:
                      'Optional custom title (default: "Frequently Asked Questions")',
                  },
                  {
                    name: "description",
                    label: "Description",
                    type: "string",
                    ui: { component: "textarea" },
                    description: "Optional description text below the title",
                  },
                ],
              },
              {
                name: "CallToAction",
                label: "Call to Action",
                fields: [
                  {
                    name: "title",
                    label: "Title",
                    type: "string",
                    required: true,
                  },
                  {
                    name: "description",
                    label: "Description",
                    type: "string",
                    ui: { component: "textarea" },
                    required: true,
                  },
                  {
                    name: "buttonText",
                    label: "Button Text",
                    type: "string",
                    required: true,
                  },
                  {
                    name: "buttonLink",
                    label: "Button Link",
                    type: "string",
                    required: true,
                  },
                ],
              },
              {
                name: "PropertyCard",
                label: "Property Card",
                fields: [
                  {
                    name: "title",
                    label: "Title",
                    type: "string",
                    required: true,
                  },
                  {
                    name: "price",
                    label: "Price",
                    type: "string",
                    required: true,
                  },
                  {
                    name: "location",
                    label: "Location",
                    type: "string",
                    required: true,
                  },
                  {
                    name: "bedrooms",
                    label: "Bedrooms",
                    type: "number",
                    required: true,
                  },
                  {
                    name: "bathrooms",
                    label: "Bathrooms",
                    type: "number",
                    required: true,
                  },
                  {
                    name: "area",
                    label: "Area",
                    type: "string",
                    required: true,
                  },
                  {
                    name: "image",
                    label: "Image",
                    type: "image",
                    required: true,
                  },
                ],
              },
              {
                name: "MarketTable",
                label: "Market Data Table",
                fields: [
                  {
                    name: "data",
                    label: "Table Data",
                    type: "object",
                    list: true,
                    fields: [
                      {
                        name: "area",
                        label: "Area",
                        type: "string",
                        required: true,
                      },
                      {
                        name: "avgPrice",
                        label: "Average Price",
                        type: "string",
                        required: true,
                      },
                      {
                        name: "growth",
                        label: "Growth",
                        type: "string",
                        required: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "faq",
        label: "FAQ Collections",
        path: "content/faqs",
        format: "json",
        ui: {
          filename: {
            readonly: true,
            slugify: (values) => {
              return `${values?.category
                ?.toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")}`
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Collection Title",
            isTitle: true,
            required: true,
            searchable: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            searchable: true,
            ui: {
              component: "textarea",
              description: "Brief description of this FAQ collection",
            },
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              { value: "general", label: "General Real Estate" },
              { value: "property", label: "Property Specific" },
              { value: "investment", label: "Investment" },
              { value: "first-time-buyer", label: "First Time Buyer" },
              { value: "documentation", label: "Legal & Documentation" },
              { value: "financing", label: "Financing & Loans" },
            ],
          },
          {
            type: "string",
            name: "projectId",
            label: "Project ID",
            description:
              "For property-specific FAQs (e.g., hill-crest-residency)",
          },
          {
            type: "object",
            name: "faqs",
            label: "FAQ Items",
            list: true,
            fields: [
              {
                type: "string",
                name: "id",
                label: "FAQ ID",
                required: true,
                description: "Unique identifier (e.g., hcr-001)",
              },
              {
                type: "string",
                name: "question",
                label: "Question",
                required: true,
                searchable: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "rich-text",
                name: "answer",
                label: "Answer",
                required: true,
                searchable: true,
              },
              {
                type: "string",
                name: "tags",
                label: "Tags",
                list: true,
                searchable: true,
                description: "Tags for filtering and organization",
              },
              {
                type: "number",
                name: "priority",
                label: "Priority",
                required: true,
                description: "Display order (1 = highest priority)",
              },
            ],
          },
        ],
      },
    ],
  },
})
