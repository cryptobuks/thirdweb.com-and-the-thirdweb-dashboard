import { ListingDrawer } from "./listing-drawer";
import {
  ButtonGroup,
  Center,
  Flex,
  Icon,
  IconButton,
  Select,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  usePrevious,
} from "@chakra-ui/react";
import {
  useActiveListings,
  useListings,
  useListingsCount,
} from "@thirdweb-dev/react";
import type {
  AuctionListing,
  DirectListing,
  Marketplace,
} from "@thirdweb-dev/sdk/evm";
import { MediaCell } from "components/contract-pages/table/table-columns/cells/media-cell";
import { BigNumber } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { Cell, Column, usePagination, useTable } from "react-table";
import { Button, Card, Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

type ListingMetadata = AuctionListing | DirectListing;

const tableColumns: Column<ListingMetadata>[] = [
  {
    Header: "Listing Id",
    accessor: (row) => row.id.toString(),
  },
  {
    Header: "Media",
    accessor: (row) => row.asset,
    Cell: (cell: any) => <MediaCell cell={cell} />,
  },
  {
    Header: "Name",
    accessor: (row) => row.asset?.name,
  },
  {
    Header: "Seller",
    accessor: (row) => row.sellerAddress,
    Cell: ({ cell }: { cell: Cell<ListingMetadata, string> }) => (
      <AddressCopyButton variant="outline" address={cell.value} />
    ),
  },
  {
    Header: "Price",
    accessor: (row) => row.buyoutCurrencyValuePerToken,
    Cell: ({ cell }: { cell: Cell<ListingMetadata, any> }) => {
      return (
        <Text size="label.md" whiteSpace="nowrap">
          {cell.value.displayValue} {cell.value.symbol}
        </Text>
      );
    },
  },
  {
    Header: "Type",
    // 0 = Direct, 1 = Auction
    accessor: (row) => (row.type === 0 ? "Direct Listing" : "Auction"),
  },
];

interface ListingsTableProps {
  contract: Marketplace;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const ListingsTable: React.FC<ListingsTableProps> = ({ contract }) => {
  const [queryParams, setQueryParams] = useState(DEFAULT_QUERY_STATE);
  const getAllQueryResult = useListings(contract, queryParams);
  const getActiveQueryResult = useActiveListings(contract, queryParams);
  const totalCountQuery = useListingsCount(contract);

  const [listingsToShow, setListingsToShow_] = useState<"all" | "active">(
    "all",
  );

  const setListingsToShow = (value: "all" | "active") => {
    setQueryParams(DEFAULT_QUERY_STATE);
    setListingsToShow_(value);
  };

  const prevData = usePrevious(
    listingsToShow === "all"
      ? getAllQueryResult?.data
      : getActiveQueryResult?.data,
  );

  const renderData = useMemo(() => {
    if (listingsToShow === "all") {
      return getAllQueryResult?.data || prevData;
    } else {
      return getActiveQueryResult?.data || prevData;
    }
  }, [getAllQueryResult, getActiveQueryResult, listingsToShow, prevData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: tableColumns,
      data: renderData || [],
      initialState: {
        pageSize: queryParams.count,
        pageIndex: 0,
      },
      manualPagination: true,
      pageCount: Math.max(
        Math.ceil(
          BigNumber.from(totalCountQuery.data || 0).toNumber() /
            queryParams.count,
        ),
        1,
      ),
    },
    usePagination,
  );

  useEffect(() => {
    setQueryParams({ start: pageIndex * pageSize, count: pageSize });
  }, [pageIndex, pageSize]);

  const [tokenRow, setTokenRow] = useState<ListingMetadata | null>(null);

  return (
    <Flex gap={4} direction="column">
      <ButtonGroup size="sm" variant="outline" isAttached>
        <Button
          onClick={() => setListingsToShow("all")}
          variant={listingsToShow === "all" ? "solid" : "outline"}
        >
          All
        </Button>
        <Button
          onClick={() => setListingsToShow("active")}
          variant={listingsToShow === "active" ? "solid" : "outline"}
        >
          Active
        </Button>
      </ButtonGroup>

      <Card maxW="100%" overflowX="auto" position="relative" px={0} py={0}>
        {((listingsToShow === "all" && getAllQueryResult.isFetching) ||
          (listingsToShow === "active" && getActiveQueryResult.isFetching)) && (
          <Spinner
            color="primary"
            size="xs"
            position="absolute"
            top={2}
            right={4}
          />
        )}
        <ListingDrawer
          contract={contract}
          data={tokenRow}
          isOpen={!!tokenRow}
          onClose={() => setTokenRow(null)}
        />
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line react/jsx-key
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // eslint-disable-next-line react/jsx-key
                  <Th {...column.getHeaderProps()} py={5}>
                    <Text as="label" size="label.md">
                      {column.render("Header")}
                    </Text>
                  </Th>
                ))}
                {/* // Need to add an empty header for the drawer button */}
                <Th />
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} position="relative">
            {page.map((row) => {
              prepareRow(row);
              return (
                // eslint-disable-next-line react/jsx-key
                <Tr
                  {...row.getRowProps()}
                  role="group"
                  _hover={{ bg: "accent.100" }}
                  // this is a hack to get around the fact that safari does not handle position: relative on table rows
                  style={{ cursor: "pointer" }}
                  onClick={() => setTokenRow(row.original)}
                  // end hack
                  borderBottomWidth={1}
                  _last={{ borderBottomWidth: 0 }}
                >
                  {row.cells.map((cell) => (
                    // eslint-disable-next-line react/jsx-key
                    <Td {...cell.getCellProps()} borderBottomWidth={"inherit"}>
                      {cell.render("Cell")}
                    </Td>
                  ))}
                  <Td borderBottomWidth="inherit">
                    <Icon as={FiArrowRight} />
                  </Td>
                </Tr>
              );
            })}
            {((listingsToShow === "all" && getAllQueryResult.isPreviousData) ||
              (listingsToShow === "active" &&
                getActiveQueryResult.isPreviousData)) && (
              <Flex
                zIndex="above"
                position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
                backdropFilter="blur(5px)"
                bg="blackAlpha.100"
                _dark={{ bg: "whiteAlpha.50" }}
                borderRadius="md"
                align="flex-end"
                justify="center"
                p={8}
              >
                <Flex align="center" gap={4}>
                  <Spinner size="sm" />
                  <Heading size="label.lg">Fetching new page</Heading>
                </Flex>
              </Flex>
            )}
          </Tbody>
        </Table>
      </Card>
      <Center w="100%">
        <Flex gap={2} direction="row" align="center">
          <IconButton
            isDisabled={!canPreviousPage || totalCountQuery.isLoading}
            aria-label="first page"
            icon={<Icon as={MdFirstPage} />}
            onClick={() => gotoPage(0)}
          />
          <IconButton
            isDisabled={!canPreviousPage || totalCountQuery.isLoading}
            aria-label="previous page"
            icon={<Icon as={MdNavigateBefore} />}
            onClick={() => previousPage()}
          />
          <Text whiteSpace="nowrap">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <Skeleton
              as="span"
              display="inline"
              isLoaded={totalCountQuery.isSuccess}
            >
              <strong>{pageCount}</strong>
            </Skeleton>
          </Text>
          <IconButton
            isDisabled={!canNextPage || totalCountQuery.isLoading}
            aria-label="next page"
            icon={<Icon as={MdNavigateNext} />}
            onClick={() => nextPage()}
          />
          <IconButton
            isDisabled={!canNextPage || totalCountQuery.isLoading}
            aria-label="last page"
            icon={<Icon as={MdLastPage} />}
            onClick={() => gotoPage(pageCount - 1)}
          />

          <Select
            onChange={(e) => {
              setPageSize(parseInt(e.target.value as string, 10));
            }}
            value={pageSize}
            isDisabled={totalCountQuery.isLoading}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </Select>
        </Flex>
      </Center>
    </Flex>
  );
};
