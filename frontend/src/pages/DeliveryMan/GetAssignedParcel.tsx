// import GlobalLoader from "@/components/Layout/GlobalLoader";
/* eslint-disable  @typescript-eslint/no-explicit-any */
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
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useLazyGetAssignedParcelQuery,
  useVerifyParcelOtpMutation,
} from "@/redux/features/parcel/parcel.api";
import { z } from "zod";

import GlobalLoader from "@/components/Layout/GlobalLoader";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSendParcelOtpMutation } from "@/redux/features/parcel/parcel.api";
import type { IAssignedParcel } from "@/types/parcel.type";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function GetAssignedParcel() {
  const [
    fetchAssignedParcels,
    { data: assignedParcel, isLoading: assignedParcelLoading },
  ] = useLazyGetAssignedParcelQuery();
  const [sendParcelOtp] = useSendParcelOtpMutation();
  const [verifyParcel, { isLoading: verifyLoading }] =
    useVerifyParcelOtpMutation();
  const [query, setQuery] = useState({
    searchTerm: "",
    page: 1,
    limit: 10,
  });

  console.log(assignedParcel);

  useEffect(() => {
    fetchAssignedParcels(query);
  }, []);

  const VerifyParcelSchema = z.object({
    tracking_number: z.string().regex(/^TRK-\d{13}-\d{3}$/, {
      message:
        "Invalid Tracking Number Format. Expected: TRK-<13digits>-<3digits>",
    }),
    otp: z.string().min(6).max(6),
  });

  const form2 = useForm<z.infer<typeof VerifyParcelSchema>>({
    resolver: zodResolver(VerifyParcelSchema),
  });
  const onSubmit = async (tracking_number: string) => {
    const toastId = toast.loading("Sending otp...");
    console.log(tracking_number);
    try {
      const res = await sendParcelOtp({ tracking_number }).unwrap();
      console.log(res);
      toast.success("OTP Sent.", { id: toastId });
    } catch (err: unknown) {
      console.log(err);
      toast.error("Something went wrong!", { id: toastId });
    }
  };
  const onSubmit2 = async (data: z.infer<typeof VerifyParcelSchema>) => {
    const toastId = toast.loading("Verifying parcel...");
    try {
      console.log(data);
      const res = await verifyParcel(data).unwrap();
      console.log(res);
      toast.success("Verify successful", { id: toastId });
    } catch (err: any) {
      console.log(err);
      form2.setError("otp", {
        type: "server",
        message: err?.data?.message,
      });
      toast.error(err?.data?.message, { id: toastId });
    }
  };
  return (
    <>
      {assignedParcelLoading ? (
        <LoaderComponent />
      ) : (
        <>
          <Table>
            <TableCaption>A list of your recent users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Tracking Number</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Status</TableHead>
                <TableHead>Parcel Type</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Receiver's Name</TableHead>
                <TableHead>Receiver's Email</TableHead>
                <TableHead>Receiver's Phone</TableHead>
                <TableHead>Receiver's Address</TableHead>
                <TableHead>Send Otp</TableHead>
                <TableHead className="">Verify Otp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedParcel?.data?.map((parcel: IAssignedParcel) => {
                return (
                  <TableRow key={parcel._id}>
                    <TableCell className="font-medium">
                      {parcel.tracking_number}
                    </TableCell>
                    <TableCell className="font-medium">
                      {parcel.weight} gm
                    </TableCell>
                    <TableCell className="font-medium">
                      {parcel.fees} Taka
                    </TableCell>
                    <TableCell>
                      {new Date(parcel.delivery_date).toLocaleString("en", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {parcel.current_status.status}
                    </TableCell>
                    <TableCell className="font-medium">
                      {parcel.current_status.paid_status}
                    </TableCell>
                    <TableCell className="font-medium">
                      {parcel.parcel_type}
                    </TableCell>
                    <TableCell>
                      {new Date(parcel.createdAt).toLocaleString("en", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="">{parcel.receiver.name}</TableCell>
                    <TableCell className="">{parcel.receiver.email}</TableCell>
                    <TableCell className="">{parcel.receiver.phone}</TableCell>
                    <TableCell className="">
                      {parcel.receiver.address}
                    </TableCell>

                    <TableCell className="">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => onSubmit(parcel.tracking_number)}
                      >
                        Send
                      </Button>
                    </TableCell>
                    <TableCell className="">
                      <Dialog
                        onOpenChange={(open) => {
                          if (open) {
                            form2.reset({
                              otp: "",
                              tracking_number: parcel.tracking_number,
                            });
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button className="cursor-pointer" variant="outline">
                            Verify
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <Form {...form2}>
                            <form onSubmit={form2.handleSubmit(onSubmit2)}>
                              <DialogHeader>
                                <DialogTitle>Verify Parcel</DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center mt-4 gap-4">
                                <FormField
                                  control={form2.control}
                                  name="otp"
                                  render={({ field }) => (
                                    <FormItem {...field}>
                                      <InputOTP maxLength={6}>
                                        <InputOTPGroup>
                                          <InputOTPSlot index={0} />
                                        </InputOTPGroup>
                                        <InputOTPGroup>
                                          <InputOTPSlot index={1} />
                                        </InputOTPGroup>
                                        <InputOTPGroup>
                                          <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                          <InputOTPSlot index={3} />
                                        </InputOTPGroup>
                                        <InputOTPGroup>
                                          <InputOTPSlot index={4} />
                                        </InputOTPGroup>
                                        <InputOTPGroup>
                                          <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                      </InputOTP>
                                      <FormMessage />
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
                                  {verifyLoading ? (
                                    <GlobalLoader />
                                  ) : (
                                    "Verify Now"
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
                {/* <TableCell colSpan={10}>Total</TableCell> */}
                {/* <TableCell className=""> Taka</TableCell> */}
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
                      assignedParcel?.meta?.page > 1
                        ? prevState.page - 1
                        : prevState.page,
                  };

                  fetchAssignedParcels(newQuery);
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
                      assignedParcel?.meta?.totalPage > prevState.page
                        ? prevState.page + 1
                        : prevState.page,
                  };
                  fetchAssignedParcels(newQuery);

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
