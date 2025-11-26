import React, { FC, Fragment, useEffect, useState } from "react"
import { Dialog, Popover, Tab, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import Image from "next/image"
import { useGlobalLeadFormState } from "@/zustand"

const navigation = {
  categories: [
    {
      id: "curent-projects",
      name: "Ongoing projects",
      featured: [
        {
          name: "Hill Crest Residency",
          href: "/hill-crest-residency",
          imageSrc:
            "/media/hcr/exterior/hill-crest-residency-exterior-view-bahria-town-karachi.webp",
          imageAlt:
            "Hill Crest Residency luxury apartments in Bahria Town Karachi with modern amenities",
        },
        {
          name: "Narkin's Boutique Residency",
          href: "/narkins-boutique-residency",
          imageSrc:
            "/media/nbr/exterior/narkins-boutique-residency-navigation-thumbnail.webp",
          imageAlt:
            "Narkin's Boutique Residency luxury apartments in Heritage Commercial Bahria Town Karachi",
        },
      ],
      sections: [
        {
          id: "curent",
          name: "Ongoing Projects",
          items: [
            { name: "Hill Crest Residency", href: "/hill-crest-residency" },
            {
              name: "Narkin's Boutique Residency",
              href: "/narkins-boutique-residency",
            },
          ],
        },
      ],
    },
    {
      id: "completed-projects",
      name: "Completed",
      featured: [
        {
          name: "Al Arz Homes",
          href: "/completed-projects?p=al-arz-homes",
          imageSrc:
            "/media/completed-projects/al-arz-homes-completed-project-narkins-builders-karachi.webp",
          imageAlt:
            "Al Arz Homes completed residential project by Narkin's Builders in Karachi",
        },
        {
          name: "Palm Residency",
          href: "/completed-projects?p=palm-residency",
          imageSrc:
            "/media/completed-projects/palm-residency-completed-project-frere-town-karachi.webp",
          imageAlt:
            "Palm Residency completed residential project in Frere Town Karachi by Narkin's Builders",
        },
        {
          name: "Al Arz Residency",
          href: "/completed-projects?p=al-arz-residency",
          imageSrc:
            "/media/completed-projects/al-arz-terrace-completed-project-narkins-builders-karachi.webp",
          imageAlt:
            "Al Arz Terrace completed residential project by Narkin's Builders in Karachi",
        },
        {
          name: "Classic Heights",
          href: "/completed-projects?p=classic-heights",
          imageSrc:
            "/media/completed-projects/classic-heights-completed-project-sharfabad-karachi.webp",
          imageAlt:
            "Classic Heights completed residential project in Sharfabad Karachi by Narkin's Builders",
        },
      ],
      sections: [
        {
          id: "housing",
          name: "Completed Projects",
          items: [
            {
              name: "Al Arz Homes",
              href: "/completed-projects?p=al-arz-homes",
            },
            {
              name: "Palm Residency",
              href: "/completed-projects?p=palm-residency",
            },
            {
              name: "Al Arz Residency",
              href: "/completed-projects?p=al-arz-residency",
            },
            {
              name: "Classic Heights",
              href: "/completed-projects?p=classic-heights",
            },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blog" },
    { name: "About", href: "/about" },
  ],
}

interface NavigationProps {
  fixed?: boolean
  transparent?: boolean
}

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

const Navigation: FC<NavigationProps> = ({
  fixed = false,
  transparent = false,
}) => {
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const setGlobalFormOpen = useGlobalLeadFormState((state) => state.setOpen)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="bg-white">
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "border-neutral-600 text-neutral-600"
                                : "border-transparent text-gray-900",
                              "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base "
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel
                        key={category.name}
                        className="space-y-10 px-4 pb-8 pt-10"
                      >
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                          {category.featured.map((item) => (
                            <div
                              key={item.name}
                              className="group relative text-sm"
                            >
                              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                <Image
                                  src={item.imageSrc}
                                  alt={item.imageAlt}
                                  className=""
                                  width={200}
                                  height={200}
                                />
                              </div>
                              <Link
                                href={item.href}
                                className="mt-6 text-black block "
                              >
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </div>
                          ))}
                        </div>
                        {category.sections.map((section) => (
                          <div key={section.name}>
                            <p
                              id={`${category.id}-${section.id}-heading-mobile`}
                              className=" text-black"
                            >
                              {section.name}
                            </p>
                            <ul
                              role="list"
                              aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                              className="mt-6 flex flex-col space-y-6"
                            >
                              {section.items.map((item) => (
                                <li key={item.name} className="flow-root">
                                  <Link
                                    href={item.href}
                                    className="-m-2 block p-2 text-black"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <Link
                        href={page.href}
                        className="-m-2 block p-2 text-black "
                      >
                        {page.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header
        style={{
          backdropFilter: "blur(5px)",
          zIndex: 100,
          background: "rgba(255, 255, 255, 0.925)",
        }}
        className={`${(fixed ?? true) ? "fixed" : "absolute"} top-0 w-[100vw] ${
          transparent ? "bg-transparent" : ""
        } ${transparent ? "text-white" : "text-gray-800"}`}
      >
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="relative rounded-md bg-transparent p-2 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <span className="sr-only">Narkins Builders</span>
                  <Image
                    className="h-8 w-auto"
                    src="/media/common/logos/narkins-builders-logo-30-years-experience.webp"
                    alt="Narkin's Builders - 30 years of construction excellence in Karachi"
                    width={120}
                    height={32}
                    quality={90}
                    priority
                    sizes="120px"
                  />
                </Link>
              </div>

              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? "border-neutral-600 text-neutral-600"
                                  : "border-transparent text-gray-700 hover:text-gray-800",
                                "relative -mb-px flex items-center border-b-2 pt-px text-sm transition-colors duration-200 ease-out"
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500 z-50">
                              <div
                                className="absolute inset-0 top-1/2 bg-white shadow"
                                aria-hidden="true"
                              />

                              <div className="relative bg-white">
                                <div className="mx-auto max-w-7xl px-8">
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-12">
                                    <div className="col-start-2">
                                      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                                        {category.featured.map((item) => (
                                          <div
                                            key={item.name}
                                            className="group relative text-sm"
                                          >
                                            <div className="aspect-[3/2] overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                                              <Image
                                                src={item.imageSrc}
                                                alt={item.imageAlt}
                                                className="w-full h-full"
                                                width={200}
                                                height={133}
                                              />
                                            </div>
                                            <Link
                                              href={item.href}
                                              className="mt-2 block text-gray-900 text-sm"
                                            >
                                              <span
                                                className="absolute inset-0"
                                                aria-hidden="true"
                                              />
                                              {item.name}
                                            </Link>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
                                      {category.sections.map((section) => (
                                        <div key={section.name}>
                                          <p
                                            id={`${section.name}-heading`}
                                            className=" text-gray-900"
                                          >
                                            {section.name}
                                          </p>
                                          <ul
                                            role="list"
                                            aria-labelledby={`${section.name}-heading`}
                                            className="mt-4 space-y-4"
                                          >
                                            {section.items.map((item) => (
                                              <li
                                                key={item.name}
                                                className="flex"
                                              >
                                                <Link
                                                  href={item.href}
                                                  className="hover:text-neutral-600 transition-colors"
                                                >
                                                  {item.name}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      href={page.href}
                      className={`flex items-center text-sm ${
                        isScrolled
                          ? "text-gray-700 hover:text-gray-800"
                          : transparent
                            ? "text-white hover:text-gray-300"
                            : "text-gray-700 hover:text-gray-800"
                      }`}
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                <div className="flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <button
                    onClick={() => setGlobalFormOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm transition duration-200"
                  >
                    Get Information
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Navigation
