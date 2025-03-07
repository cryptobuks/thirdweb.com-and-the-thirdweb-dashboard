import {
  ConnectWalletImage,
  DashboardImage,
  Titles,
} from "./components/Graphics";
import { SlideStateProps, TRACK_CATEGORY } from "./shared";
import React from "react";
import { Text, TrackedLink } from "tw-components";

export interface Slide {
  title: React.ReactNode;
  background: string;
  graphic: React.FC<SlideStateProps>;
  content: React.ReactNode;
}

export const slides: Slide[] = [
  // slide 1
  {
    title: (
      <>
        The complete web3 <br />
        development framework.
      </>
    ),
    background: "linear-gradient(147.15deg, #410AB6 30.17%, #B4F1FF 100.01%)",
    graphic: DashboardImage,
    content: (
      <Text size="body.lg" w="90%">
        Everything you need to connect your apps or games to decentralized
        networks. Powerful tools that simplify web3 development.
      </Text>
    ),
  },

  // slide 2
  {
    title: "Speed up development.",
    background: "linear-gradient(147.15deg, #410AB6 30.17%, #D45CFF 100.01%)",
    graphic: Titles,
    content: (
      <Text size="body.lg">
        Build your own contracts with{" "}
        <TrackedLink
          color="blue.500"
          href="https://portal.thirdweb.com/contractkit"
          category={TRACK_CATEGORY}
          label="build-contractkit"
          isExternal
        >
          ContractKit
        </TrackedLink>
        .
        <br />
        Discover ready-to-deploy contracts with{" "}
        <TrackedLink
          color="blue.500"
          href="/explore"
          category={TRACK_CATEGORY}
          label="build-explore"
        >
          Explore
        </TrackedLink>{" "}
        .
        <br />
        Integrate any contract into your app with autogenerated{" "}
        <TrackedLink
          color="blue.500"
          href="https://portal.thirdweb.com/sdk"
          category={TRACK_CATEGORY}
          label="build-sdks"
          isExternal
        >
          SDKs
        </TrackedLink>
        .
      </Text>
    ),
  },

  // slide 3
  {
    title: (
      <>
        One-click deploys, <br /> no private keys.
      </>
    ),
    background: "linear-gradient(147.15deg, #410AB6 30.17%, #5CFFE1 100.01%)",
    graphic: Titles,
    content: (
      <Text size="body.lg">
        Deploy contracts securely using{" "}
        <TrackedLink
          color="blue.500"
          href="https://portal.thirdweb.com/cli"
          category={TRACK_CATEGORY}
          label="launch-cli"
          isExternal
        >
          CLI
        </TrackedLink>{" "}
        and{" "}
        <TrackedLink
          color="blue.500"
          href="https://portal.thirdweb.com/dashboard"
          category={TRACK_CATEGORY}
          label="launch-dashboard"
          isExternal
        >
          Dashboard
        </TrackedLink>
        .
        <br />
        Scale apps easily without worrying about web3 infrastructure.
        <br />
        Create shareable landing pages for contracts with{" "}
        <TrackedLink
          color="blue.500"
          href="https://portal.thirdweb.com/release"
          category={TRACK_CATEGORY}
          label="launch-release"
          isExternal
        >
          Release
        </TrackedLink>
        .
      </Text>
    ),
  },

  // slide 4
  {
    title: "On-chain analytics and control.",
    background: "linear-gradient(147.15deg, #B4F1FF -10.17%, #410AB6 100.01%)",
    graphic: Titles,
    content: (
      <Text size="body.lg">
        Monitor on-chain acitivity with{" "}
        <TrackedLink
          color="blue.500"
          href="https://portal.thirdweb.com/dashboard/activity-feed"
          category={TRACK_CATEGORY}
          label="manage-dashboard"
          isExternal
        >
          Analytics
        </TrackedLink>
        .
        <br />
        Interact directly with contracts using{" "}
        <TrackedLink
          color="blue.500"
          href="https://portal.thirdweb.com/dashboard"
          category={TRACK_CATEGORY}
          label="manage-dashboard"
          isExternal
        >
          Dashboard
        </TrackedLink>
        .
        <br />
        Control your team&apos;s access with{" "}
        <TrackedLink
          color="blue.500"
          href="https://portal.thirdweb.com/dashboard/permission-controls"
          category={TRACK_CATEGORY}
          label="manage-dashboard"
          isExternal
        >
          Permissions
        </TrackedLink>
        .
      </Text>
    ),
  },

  // slide 5
  {
    title: "Connect a wallet to get started.",
    background: "linear-gradient(147.15deg, #410AB6 30.17%, #FF8D5C 100.01%)",
    graphic: ConnectWalletImage,
    content: (
      <Text size="body.lg" w="90%">
        By connecting your wallet you acknowledge that you have read and agree
        to our{" "}
        <TrackedLink
          href="/privacy"
          isExternal
          category="notice"
          label="privacy"
          textDecoration="underline"
          _hover={{
            opacity: 0.8,
          }}
        >
          Privacy Policy
        </TrackedLink>{" "}
        and{" "}
        <TrackedLink
          href="/tos"
          isExternal
          category="notice"
          label="terms"
          textDecoration="underline"
          _hover={{
            opacity: 0.8,
          }}
        >
          Terms of Service
        </TrackedLink>
        .
      </Text>
    ),
  },
];

export const lastSlideIndex = slides.length - 1;
