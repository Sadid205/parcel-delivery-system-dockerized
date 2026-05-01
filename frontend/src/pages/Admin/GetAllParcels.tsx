import LoaderComponent from "@/components/Layout/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { toast } from "sonner"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { z } from "zod";

import GlobalLoader from "@/components/Layout/GlobalLoader";
import {
  useLazyGetParcelQuery,
  useUpdateParcelStatusMutation,
} from "@/redux/features/parcel/parcel.api";
import type { IHistory } from "@/types/parcel.type";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function GetAllParcels() {
  const [updateParcelStatus, { isLoading: updateStatusLoading }] =
    useUpdateParcelStatusMutation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState({
    searchTerm: "",
    page: 1,
    limit: 10,
  });

  const [fetchParcels, { data: allParcel, isLoading }] =
    useLazyGetParcelQuery();
  useEffect(() => {
    fetchParcels(query);
  }, []);

  // console.log(histories, query);

  const total = allParcel?.data?.reduce(
    (acc: number, curr: IHistory) => acc + curr.fees,
    0
  );

  const parcelStatus = [
    "REQUESTED",
    "APPROVED",
    "DISPATCHED",
    "IN_TRANSIT",
    "DELIVERED",
    "CANCELLED",
    "BLOCKED",
    "RETURNED",
    "RESCHEDULED",
  ] as const;
  const paidStatus = ["PAID", "UNPAID"] as const;
  const FormSchema = z.object({
    id: z.string(),
    status: z.enum(parcelStatus),
    paid_status: z.enum(paidStatus),
    delivery_date: z.date(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const updateParcelData = {
      status: data.status,
      paid_status: data.paid_status,
      delivery_date: DateTime.fromJSDate(data.delivery_date)
        .setZone("Asia/Dhaka")
        .toFormat("yyyy-MM-dd"),
    };
    console.log(updateParcelData);
    console.log({ id: data.id });
    const toastId = toast.loading("Parcel status is updating...");
    try {
      const res: any = await updateParcelStatus({
        tracking_number: data.id,
        parcel_status: updateParcelData,
      });
      console.log(res);
      if (res?.error?.data?.success === false) {
        toast.error(res?.error?.data?.message, { id: toastId });
      } else if (res?.data?.success === true) {
        toast.success(res?.data?.message, { id: toastId });
      } else {
        toast.error("Something went wrong!", { id: toastId });
      }
      setOpen(false);
    } catch (err: unknown) {
      console.log(err);
      setOpen(false);
    }
  };

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
              onClick={() => {
                fetchParcels(query);
              }}
            >
              Search
            </Button>
          </div>
          <Table>
            <TableCaption>A list of your recent historys.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Tracking Number</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Parcel Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Status</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Receiver Address</TableHead>
                <TableHead>Receiver Phone</TableHead>
                <TableHead>Receiver Email</TableHead>
                <TableHead>Charge</TableHead>
                <TableHead className="">Cancel Parcel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allParcel?.data?.map((history: IHistory) => {
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
                    <TableCell className="">
                      {history.receiver.address}
                    </TableCell>
                    <TableCell className="">{history.receiver.phone}</TableCell>
                    <TableCell className="">{history.receiver.email}</TableCell>
                    <TableCell className="">৳ {history.fees}</TableCell>
                    <TableCell className="">
                      <Dialog
                        onOpenChange={(open) => {
                          if (open) {
                            form.reset({
                              id: history.tracking_number,
                              status: history.current_status
                                .status as (typeof parcelStatus)[number],
                              paid_status: history.current_status
                                .paid_status as (typeof paidStatus)[number],
                              delivery_date: undefined,
                            });
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline">Change Status</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                              <DialogHeader>
                                <DialogTitle>Change Parcel Status</DialogTitle>
                              </DialogHeader>
                              <div className="flex mt-4 justify-between">
                                <FormField
                                  control={form.control}
                                  name="status"
                                  render={({ field }) => (
                                    <FormItem>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {parcelStatus.map((st, index) => (
                                            <SelectItem key={index} value={st}>
                                              {st}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="paid_status"
                                  render={({ field }) => (
                                    <FormItem>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a paid status" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {paidStatus.map((st, index) => (
                                            <SelectItem key={index} value={st}>
                                              {st}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="delivery_date"
                                  render={({ field }) => (
                                    <FormItem>
                                      <Popover
                                        open={open}
                                        onOpenChange={setOpen}
                                      >
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            id="date"
                                            className="w-48 justify-between font-normal"
                                          >
                                            {field.value
                                              ? DateTime.fromJSDate(field.value)
                                                  .setZone("Asia/Dhaka")
                                                  .toFormat("yyyy-MM-dd")
                                              : "Select delivery date"}
                                            <ChevronDownIcon />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto overflow-hidden p-0"
                                          align="start"
                                        >
                                          <Calendar
                                            mode="single"
                                            selected={field.value}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                              field.onChange(date);
                                              setOpen(false);
                                            }}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="submit"
                                  className="cursor-pointer"
                                >
                                  {updateStatusLoading ? (
                                    <GlobalLoader />
                                  ) : (
                                    "Update Status"
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={10}>Total</TableCell>
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
                      allParcel?.meta?.page > 1
                        ? prevState.page - 1
                        : prevState.page,
                  };

                  fetchParcels(newQuery);
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
                      allParcel?.meta?.totalPage > prevState.page
                        ? prevState.page + 1
                        : prevState.page,
                  };
                  fetchParcels(newQuery);

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
