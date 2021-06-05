import Toggle from "./themeToggle";
import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

import BgCover from "./bgCover";

import {
  TempleIcon,
  LeafIcon,
  LotusIcon,
  LogoMain,
  GithubIcon,
  MediumIcon,
  TwitterIcon,
  DiscordIcon,
  Roadmap_Icon1,
  Roadmap_Icon2,
  Roadmap_Icon3,
} from "./svgs";

import logo3d from "../logo3d.svg";

const App = () => {
  return (
    <>
      <div className="relative above-the-fold overflow-hidden">
        <BgCover />

        <div className="p-4 lg:p-6 lg:px-8">
          <Nav />
        </div>

        <div className="max-w-3xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <Hero />
        </div>

        <div className="mx-auto max-w-xl pb-16 md:pb-20 mt-16 md:mt-20">
          <dl className="grid px-10 grid-cols-4">
            <dd className="flex justify-center align-center">
              <a
                className="text-xl block pt-2 font-bold text-white xl:-ml-0 justify-center"
                href="https://github.com/Taoist-DAO/TaoDAO"
              >
                <GithubIcon className="w-8 m-3 dark:text-white" />
              </a>
            </dd>
            <dd className="flex justify-center align-center">
              <a
                className="text-xl block pt-2 font-bold text-white xl:-ml-0"
                href="https://taodao-finance.medium.com/"
              >
                <MediumIcon className="w-8 m-3 dark:text-white" />
              </a>
            </dd>

            <dd className="flex justify-center align-center">
              <a
                className="text-xl block pt-2 font-bold text-white xl:-ml-0"
                href="https://twitter.com/TaoDAO_Finance"
              >
                <TwitterIcon className="w-8 m-3 dark:text-white" />
              </a>
            </dd>

            <dd className="flex justify-center align-center">
              <a
                className="text-xl block pt-2 font-bold text-white xl:-ml-0"
                href="https://discord.com/invite/vFTCUZ7mpJ"
              >
                <DiscordIcon className="w-8 m-3 dark:text-white" />
              </a>
            </dd>
          </dl>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-black bg-wave">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <Hero2nd />
        </div>

        <div className="mx-auto max-w-4xl px-10 md:px-0">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <FeatureItem
              icon={<LeafIcon className="text-gold h-20" />}
              title="To Asset Managers"
              route="Enter Exchange"
            >
              <p className="leading-relaxed prose py-2 px-4 text-sm text-gray-500 dark:text-gray-500">
                A focus on ease of use and intuitive design. Leverage your
                skills to generate returns in any market condition using a wide
                variety of products such as options, derivatives and indexes.
              </p>
            </FeatureItem>
            <FeatureItem
              icon={<TempleIcon className="text-gold h-20" />}
              title="To Investors"
              route="Enter Swap"
            >
              <p className="leading-relaxed prose py-2 px-4 text-sm text-gray-500 dark:text-gray-500">
                We provide an easy and transparent solution to creating passive
                income. An insight to how fund managers operate their
                investments. Keeping it simple for investors to pick and track
                asset managers.
              </p>
            </FeatureItem>
            <FeatureItem
              icon={<LotusIcon className="text-gold h-20" />}
              title="TAO"
              route="Enter ZEN"
            >
              <p className="leading-relaxed prose py-2 px-4 text-sm prose text-gray-500 dark:text-gray-500">
                Tao provides a trustless system to bridge between asset managers
                and investors. The TAO token will create value accrual through
                DAO managed fees charged for access to our services and
                products.
              </p>
            </FeatureItem>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center py-20 px-4 sm:py-20 lg:py-24 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-black sm:text-2xl dark:text-white">
          This is the way of Tao. Follow our journey.
        </h3>

        <div className="flex justify-center pt-10">
          <div className="flex px-2">
            <a
              className="text-xl block pt-2 font-bold text-white xl:-ml-0 justify-center"
              href="https://github.com/Taoist-DAO/TaoDAO"
            >
              <GithubIcon className="text-black w-8 m-3 dark:text-white" />
            </a>
          </div>
          <div className="flex px-2">
            <a
              className="text-xl block pt-2 font-bold text-white xl:-ml-0"
              href="https://taodao-finance.medium.com/"
            >
              <MediumIcon className="text-black w-8 m-3 dark:text-white" />
            </a>
          </div>
          <div className="flex px-2">
            <a
              className="text-xl block pt-2 font-bold text-white xl:-ml-0"
              href="https://taodao-finance.medium.com/"
            >
              <TwitterIcon className="text-black w-8 m-3 dark:text-white" />
            </a>
          </div>
          <div className="flex px-2">
            <a
              className="text-xl block pt-2 font-bold text-white xl:-ml-0"
              href="https://discord.com/invite/vFTCUZ7mpJ"
            >
              <DiscordIcon className="text-black w-8 m-3 dark:text-white" />
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl pb-28 sm:pb-32">
        <Footer />
      </div>
    </>
  );
};

function Roadmap() {
  return (
    <div id="roadmap" className="overflow-auto scrolling-touch">
      <div
        id="inner-roadmap"
        className="mx-auto overflow-hidden mb-20 lg:mb-24"
      >
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-10 grid-cols-1 md:grid-cols-3">
            <Carousel_Item
              icon={
                <Roadmap_Icon1 className="h-32 rounded-full p-2 border border-gold text-white dark:text-blackish" />
              }
            />
            <Carousel_Item
              icon={
                <Roadmap_Icon2 className="h-32 rounded-full p-2 border border-gold text-white dark:text-blackish" />
              }
            />
            <Carousel_Item
              icon={
                <Roadmap_Icon3 className="h-32 rounded-full p-2 border border-gold text-white dark:text-blackish" />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, children, route }) {
  return (
    <div className="py-20 rounded-full text-center bg-white p-4 dark:bg-blackish">
      <div className="flex justify-center align-center pb-4">{icon}</div>
      <h4 className="text-base font-medium text-gray-900 dark:text-white">
        {title}
      </h4>
      {children}
      <a
        disabled
        className="inline-flex mt-2 items-center justify-center px-6 py-3 text-sm leading-4 w-40 font-medium rounded-full text-white bg-black dark:bg-black dark:text-white hover:bg-gold hover:text-black dark:hover:bg-gold dark:hover:text-black"
      >
        Coming soon
      </a>
    </div>
  );
}

function Hero2nd() {
  return (
    <>
      <h3
        id="what"
        className="text-2xl tracking-wide text-black sm:text-xl dark:text-white"
      >
        <span className="block">
          We strive to provide freedom and accessibility to the full breath of
          the wider DeFi Ecosystem. Built on L2 Arbitrum & Optimism.
        </span>
      </h3>
    </>
  );
}

function Hero() {
  return (
    <>
      <div className="flex align-center justify-center py-10">
        <img className="md:h-48 h-40" src={logo3d} alt="TAO DAO" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white sm:text-4xl">
        A DeFi Asset Management Ecosystem
      </h2>
      <p className="leading-loose tracking-wide mt-4 text-lg leading-6 text-white dark:text-white">
        TaoDAO is a DAO governed ecosystem focusing on decentralised asset management. We connect investors with professional fund managers.
      </p>
      <a
        href="https://app.taodao.finance/dashboard"
        className="mt-8 inline-flex items-center tracking-wide justify-center px-8 py-2 border border-transparent text-lg font-bold rounded-full text-black dark:text-black dark:bg-white bg-white dark:text-white hover:bg-gold dark:hover:bg-gold dark:hover:text-black sm:w-auto"
      >
        Find The Way
      </a>
    </>
  );
}

function Nav() {
  return (
    <>
      <div className="flex">
        <div className="flex-none">
          <a
            className="text-xl block pt-2 font-bold text-white xl:-ml-0"
            href="/"
          >
            <LogoMain className="h-6 sm:h-7" />
          </a>
        </div>
        <div className="flex-grow"></div>
        <div className="flex-none -mr-2 lg:mr-0">
          <div className="hidden space-x-4 md:flex">
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <Menu.Button className="p-2 block text-base font-medium text-white hover:text-gold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold">
                    Developers
                  </Menu.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="dark:bg-black origin-top-right absolute mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black"
                    >
                      <div className="py-1">
                        <Menu.Item as="a">
                          {({ active }) => (
                            <a
                              href="https://taodao.gitbook.io/taodao"
                              className="block px-4 py-2 text-black dark:text-white hover:text-black hover:bg-gold dark:hover:text-black"
                            >
                              Gitbook
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="https://github.com/Taoist-DAO/TaoDAO"
                              className="block px-4 py-2 text-black dark:text-white hover:text-black hover:bg-gold dark:hover:text-black"
                            >
                              Github
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <Menu.Button className="p-2 block text-base font-medium text-white hover:text-gold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold">
                    Learn
                  </Menu.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="origin-top-right absolute mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:text-white"
                    >
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#what"
                              className="block px-4 py-2 text-black dark:text-white hover:text-black hover:bg-gold dark:hover:text-black"
                            >
                              What is TAO?
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="https://taodao-finance.medium.com/"
                              className="block px-4 py-2 text-black dark:text-white hover:text-black hover:bg-gold dark:hover:text-black"
                            >
                              Blog
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <Menu.Button className="p-2 block text-base font-medium text-white hover:text-gold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold">
                    Governance
                  </Menu.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="dark:bg-black origin-top-right absolute mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black"
                    >
                      <div className="py-1">
                        <Menu.Item as="a">
                          {({ active }) => (
                            <a
                              href="https://scattershot.page/#/taodao.eth"
                              className="block px-4 py-2 text-black dark:text-white hover:text-black hover:bg-gold dark:hover:text-black"
                            >
                              Vote
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="https://taodaofinance.flarum.cloud/"
                              className="block px-4 py-2 text-black dark:text-white hover:text-black hover:bg-gold dark:hover:text-black"
                            >
                              Forum
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

            <Toggle />
            <a
              href="https://app.taodao.finance/dashboard"
              style={{ borderWidth: "2px" }}
              className="inline-flex items-center px-5 py-2 text-sm leading-4 font-medium rounded-full text-white border hover:text-black dark:text-white hover:bg-gold hover:border-gold dark:hover:text-black"
            >
              Enter App
            </a>
          </div>

          <div className="-mr-2 flex items-center md:hidden px-4">
            <Toggle />

            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <Menu.Button className="p-2 block text-base font-medium text-white hover:text-gold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold">
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Menu.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="origin-top-right absolute -ml-28 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:text-white"
                    >
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#what"
                              className="block px-4 py-2 text-black dark:text-white hover:text-black hover:bg-gold dark:hover:text-black"
                            >
                              What is TAO?
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="https://taodao-finance.medium.com/"
                              className="block px-4 py-2 text-black dark:text-white hover:text-black hover:bg-gold dark:hover:text-black"
                            >
                              Blog
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
}

function Carousel_Item({ icon }) {
  return (
    <div className="text-center text-sm leading-loose dark:text-white">
      <div className="flex align-center justify-center content-center mb-4">
        <div className="h-32 w-32">{icon}</div>
      </div>
      <h3 className="font-semibold text-base">Quarter 2</h3>
      <div className="text-center">
        <ul>
          <li>• Governance</li>
          <li>• BUSD bonds</li>
          <li>• Website v2 + analysis</li>
        </ul>
      </div>
    </div>
  );
}

function OpsItem({ title, icon }) {
  return (
    <div className="flex">
      <div className="flex-none w-16 pt-2 pr-4 dark:text-white">{icon}</div>
      <div className="flex-grow">
        <h4 className="text-base font-semibold pb-1 dark:text-white">
          {title}
        </h4>
        <p className="prose text-sm dark:text-white">
          New TAO is Created via direct sales into the market. These sales
          increase linearly with the market premium and produce profits for
          stakeholders.
        </p>
      </div>
    </div>
  );
}

const navigation = {
  developers: [
    { name: "Gibook", href: "https://taodao.gitbook.io/taodao/" },
    { name: "Github", href: "https://github.com/Taoist-DAO/TaoDAO" },
  ],
  learn: [
    { name: "What is Tao?", href: "/#what" },
    { name: "Blog", href: "https://taodao-finance.medium.com/" },
  ],
  community: [
    { name: "Twitter", href: "https://twitter.com/TaoDAO_Finance" },
    { name: "Discord", href: "https://discord.com/invite/vFTCUZ7mpJ" },
  ],
};

function Footer() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col xl:grid xl:grid-cols-4">
        <div className="flex xl:col-span-1 justify-center">
          <div className="w-40 -mb-10">
            <a
              className="block font-bold text-black dark:text-white xl:-ml-0"
              href="/"
            >
              <LogoMain />
            </a>
          </div>
        </div>
        <div className="py-16 xl:py-0 grid grid-cols-1 gap-8 xl:mt-0 xl:col-span-2">
          <div className="flex flex-inline text-center pt-8 xl:pt-0 xl:text-left">
            <div className="w-1/3">
              <h3 className="text-sm text-black font-semibold tracking-wider dark:text-white">
                Developers
              </h3>
              <ul className="mt-4 space-y-2">
                {navigation.developers.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-black hover:text-gray-900 dark:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/3">
              <h3 className="text-sm text-black font-semibold tracking-wider dark:text-white">
                Learn
              </h3>
              <ul className="mt-4 space-y-2">
                {navigation.learn.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-black hover:text-gray-900 dark:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/3">
              <h3 className="text-sm text-black font-semibold tracking-wider dark:text-white">
                Community
              </h3>
              <ul className="mt-4 space-y-2">
                {navigation.community.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-black hover:text-gray-900 dark:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="space-y-8 xl:col-span-1">
          <div className="flex md:grid md:gap-8 justify-center">
            <a
              href="https://app.taodao.finance/dashboard"
              className="w-max max-h-40 items-center px-10 py-5 text-xl leading-4 font-medium rounded-full text-white bg-black dark:text-black dark:bg-white hover:bg-gold hover:text-black"
            >
              Enter App
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ isLoading, number, label }) {
  if (isLoading) {
    return (
      <div className="p-4 bg-white bg-opacity-30 dark:bg-opacity-40 rounded-xl overflow-hidden sm:px-4 flex align-center justify-center">
        <div className="animate-pulse rounded-full h-16 w-16 bg-white dark:bg-white"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white bg-opacity-30 dark:bg-opacity-40 rounded-xl overflow-hidden sm:px-4 text-center">
      <dd className="text-2xl font-semibold text-white">{number}</dd>
      <dt className="text-sm text-white truncate dark:text-white">{label}</dt>
    </div>
  );
}

export default App;
