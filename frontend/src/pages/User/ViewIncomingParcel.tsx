/* eslint-disabled @typescript-eslint/no-explicit-any */
import GlobalLoader from "@/components/Layout/GlobalLoader";
import LoaderComponent from "@/components/Layout/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLazyGetIncomingParcelQuery } from "@/redux/features/parcel/parcel.api";
import type { IHistory } from "@/types/parcel.type";
import { useEffect, useState } from "react";

export default function ViewIncomingParcel() {
  const [query, setQuery] = useState({
    searchTerm: "",
    page: 1,
    limit: 10,
  });

  const [fetchParcel, { data: parcels, isLoading }] =
    useLazyGetIncomingParcelQuery();
  useEffect(() => {
    fetchParcel(query);
  }, []);

  // console.log(histories, query);

  const total = parcels?.data?.reduce(
    (acc: number, curr: IHistory) => acc + curr.fees,
    0
  );

  return (
    <>
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <>
          <div className="flex gap-5 max-w-md">
            <Input
              value={query.searchTerm}
              onChange={(e) =>
                setQuery({ ...query, searchTerm: e.target.value })
              }
              placeholder="Search"
            />
            <Button
              className="cursor-pointer"
              onClick={() => {
                fetchParcel(query);
              }}
            >
              {isLoading ? <GlobalLoader /> : "Search"}
            </Button>
          </div>
          <Table>
            <TableCaption>A list of your incoming parcel.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Tracking Number</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Parcel Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Status</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Charge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parcels?.data?.map((history: IHistory) => {
                return (
                  <TableRow key={history.tracking_number}>
                    <TableCell className="font-medium">
                      {history.tracking_number}
                    </TableCell>
                    <TableCell>
                      {new Date(history.createdAt).toLocaleString("en", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {history.parcel_type}
                    </TableCell>
                    <TableCell className="">
                      {history.current_status.status}
                    </TableCell>
                    <TableCell className="">
                      {history.current_status.paid_status}
                    </TableCell>
                    <TableCell className="">
                      {new Date(history.delivery_date).toLocaleString("en", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="">{history.weight} gm</TableCell>
                    <TableCell className="">৳ {history.fees}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>Total</TableCell>
                <TableCell className="">{total} Taka</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => {
                setQuery((prevState) => {
                  const newQuery = {
                    ...prevState,
                    page:
                      parcels?.meta?.page > 1
                        ? prevState.page - 1
                        : prevState.page,
                  };

                  fetchParcel(newQuery);
                  return newQuery;
                });
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{query.page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => {
                setQuery((prevState) => {
                  const newQuery = {
                    ...prevState,
                    page:
                      parcels?.meta?.totalPage > prevState.page
                        ? prevState.page + 1
                        : prevState.page,
                  };
                  fetchParcel(newQuery);

                  return newQuery;
                });
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
