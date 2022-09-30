import { Route } from "@tanstack/react-location";
import { contractType, useContract } from "@thirdweb-dev/react";
import {
  ExtensionDetectedState,
  extensionDetectedState,
} from "components/buttons/ExtensionDetectButton";
import { ens } from "components/contract-components/hooks";
import { ProgramCodeTab } from "program-ui/common/program-code";

// import { useEffect } from "react";

export type EnhancedRoute = Route & {
  title: string;
  path: string;
  isEnabled?: ExtensionDetectedState;
};

export function useRouteConfig(ecosystem: "evm" | "solana", address: string) {
  if (ecosystem === "evm") {
    // we know what we're doing here, importantly ecosystem is NEVER allowed to change.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useContractRouteConfig(address);
  }

  // we know what we're doing here, importantly ecosystem is NEVER allowed to change.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useProgramRoueConfig(address);
}

export function useProgramRoueConfig(programAddress: string): EnhancedRoute[] {
  return [
    {
      title: "Overview",
      path: "/",
      element: () =>
        import("components/pages/program").then(({ ProgramOverviewTab }) => (
          <ProgramOverviewTab address={programAddress} />
        )),
    },
    {
      title: "Code",
      path: "/code",
      element: <ProgramCodeTab address={programAddress} />,
    },
    {
      title: "Settings",
      path: "/settings",
      element: <>settings tab goes here</>,
    },
  ];
}

export function useContractRouteConfig(
  contractAddress: string,
): EnhancedRoute[] {
  const ensQuery = ens.useQuery(contractAddress);
  const contractQuery = useContract(ensQuery.data?.address);

  const contractTypeQuery = contractType.useQuery(contractAddress);
  const embedEnabled =
    contractTypeQuery.data === "nft-drop" ||
    contractTypeQuery.data === "marketplace" ||
    contractTypeQuery.data === "edition-drop" ||
    contractTypeQuery.data === "token-drop" ||
    contractTypeQuery.data === "signature-drop";

  return [
    {
      title: "Explorer",
      path: "/",
      element: () =>
        import("../tabs/overview/page").then(
          ({ CustomContractOverviewPage }) => (
            <CustomContractOverviewPage contractAddress={contractAddress} />
          ),
        ),
    },
    {
      title: "Events",
      path: "events",
      element: () =>
        import("../tabs/events/page").then(({ ContractEventsPage }) => (
          <ContractEventsPage contractAddress={contractAddress} />
        )),
    },
    {
      title: "NFTs",
      path: "nfts",
      isEnabled: extensionDetectedState({
        contractQuery,
        feature: ["ERC1155", "ERC721"],
      }),
      element: () =>
        import("../tabs/nfts/page").then(({ ContractNFTPage }) => (
          <ContractNFTPage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Tokens",
      path: "tokens",
      isEnabled: extensionDetectedState({ contractQuery, feature: "ERC20" }),
      element: () =>
        import("../tabs/tokens/page").then(({ ContractTokensPage }) => (
          <ContractTokensPage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Listings",
      path: "listings",
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "marketplace"
        ? "enabled"
        : "disabled",
      element: () =>
        import("../tabs/listings/page").then(({ ContractListingsPage }) => (
          <ContractListingsPage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Balances",
      path: "split",
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "split"
        ? "enabled"
        : "disabled",
      element: () =>
        import("../tabs/split/page").then(({ ContractSplitPage }) => (
          <ContractSplitPage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Proposals",
      path: "proposals",
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : contractTypeQuery.data === "vote"
        ? "enabled"
        : "disabled",
      element: () =>
        import("../tabs/proposals/page").then(({ ContractProposalsPage }) => (
          <ContractProposalsPage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Claim Conditions",
      path: "claim-conditions",
      isEnabled: extensionDetectedState({
        contractQuery,
        feature: [
          "ERC721ClaimableWithConditions",
          "ERC20ClaimableWithConditions",
        ],
      }),
      element: () =>
        import("../tabs/claim-conditions/page").then(
          ({ ContractClaimConditionsPage }) => (
            <ContractClaimConditionsPage contractAddress={contractAddress} />
          ),
        ),
    },
    {
      title: "Permissions",
      path: "permissions",
      isEnabled: extensionDetectedState({
        contractQuery,
        feature: "Permissions",
      }),
      element: () =>
        import("../tabs/permissions/page").then(
          ({ ContractPermissionsPage }) => (
            <ContractPermissionsPage contractAddress={contractAddress} />
          ),
        ),
    },
    {
      title: "Embed",
      path: "embed",
      element: () =>
        import("../tabs/embed/page").then(({ CustomContractEmbedPage }) => (
          <CustomContractEmbedPage contractAddress={contractAddress} />
        )),
      isEnabled: contractTypeQuery.isLoading
        ? "loading"
        : embedEnabled
        ? "enabled"
        : "disabled",
    },
    {
      title: "Code",
      path: "code",
      element: () =>
        import("../tabs/code/page").then(({ ContractCodePage }) => (
          <ContractCodePage contractAddress={contractAddress} />
        )),
    },
    {
      title: "Settings",
      path: "settings",
      element: () =>
        import("../tabs/settings/page").then(
          ({ CustomContractSettingsTab }) => (
            <CustomContractSettingsTab contractAddress={contractAddress} />
          ),
        ),
    },
    {
      title: "Sources",
      path: "sources",
      element: () =>
        import("../tabs/sources/page").then(({ CustomContractSourcesPage }) => (
          <CustomContractSourcesPage contractAddress={contractAddress} />
        )),
    },
  ];
}
