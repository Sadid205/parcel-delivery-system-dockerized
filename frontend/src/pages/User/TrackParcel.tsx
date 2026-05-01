import GlobalLoader from "@/components/Layout/GlobalLoader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLazyTrackParcelQuery } from "@/redux/features/parcel/parcel.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const formSchema = z.object({
  tracking_number: z
    .string()
    .regex(/^TRK-\d+(?:-\d+)?$/, {
      message: "Invalid tracking number format.",
    }),
});
type Parcel = {
  trackingEvents: Array<{
    status: string;
    paid_status: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  }>;
};
export default function TrackParcel() {
  const [trackedParcel, setTrackedParcel] = useState<Parcel | null>(null);
  const [trackParcel, { isLoading }] = useLazyTrackParcelQuery();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tracking_number: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setTrackedParcel(null);

    const toastId = toast.loading("Trying to track parcel ....");
    try {
      const res = await trackParcel(data.tracking_number).unwrap();
      form.reset({
        tracking_number: "",
      });
      if (res.statusCode === 200) {
        toast.success("Successfully tracked parcel.", { id: toastId });
        setTrackedParcel(res.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      form.setError("tracking_number", {
        type: "manual",
        message: err?.data?.message ?? "Something went wrong",
      });
      toast.error(err?.data?.message ?? "Something went wrong!", {
        id: toastId,
      });
    }
  };
  console.log(trackedParcel);
  return (
    <div className=" max-w-screen flex min-h-screen flex-col gap-6 justify-center items-center m-auto">
      {trackedParcel && (
        <div className="w-full justify-end items-start gap-8 inline-flex">
          <div className="w-full flex-col justify-start items-start gap-8 inline-flex">
            <div className="w-full p-8 bg-white rounded-xl flex-col justify-start items-start gap-5 flex">
              <h2 className="w-full text-gray-900 text-2xl font-semibold font-manrope leading-9 pb-5 border-b border-gray-200">
                Parcel Tracking
              </h2>
              <div className="w-full flex-col justify-center items-center">
                <ol className="flex md:flex-row flex-col md:items-start items-center justify-between w-full md:gap-1 gap-4">
                  {trackedParcel &&
                    trackedParcel.trackingEvents?.map(
                      (event: {
                        status: string;
                        paid_status: string;
                        _id: string;
                        createdAt: string;
                        updatedAt: string;
                      }) => (
                        <li
                          key={event._id}
                          className="group flex relative justify-start after:content-[''] lg:after:w-11 md:after:w-5 after:w-5 after:h-0.5 md:after:border after:border-dashed md:after:bg-gray-500 after:inline-block after:absolute md:after:top-7 after:top-3 xl:after:left-44 lg:after:left-40 md:after:left-36"
                        >
                          <div className="w-full mr-1 block z-10 flex flex-col items-center justify-start gap-1">
                            <div className="justify-center items-center gap-1.5 inline-flex">
                              <h5 className="text-center text-gray-900 text-lg font-medium leading-normal">
                                {event.status}
                              </h5>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                                fill="none"
                              >
                                <path
                                  d="M9.10815 11.2157C9.10815 11.2157 9.11044 11.2147 9.11433 11.2141C9.10997 11.2157 9.10815 11.2157 9.10815 11.2157Z"
                                  fill="#047857"
                                />
                                <path
                                  d="M9.13686 11.2157C9.13686 11.2157 9.13456 11.2147 9.13068 11.2141C9.13331 11.2151 9.136 11.2157 9.136 11.2157L9.13686 11.2157Z"
                                  fill="#047857"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M1.83337 9.99992C1.83337 5.48959 5.48972 1.83325 10 1.83325C14.5104 1.83325 18.1667 5.48959 18.1667 9.99992C18.1667 14.5102 14.5104 18.1666 10 18.1666C5.48972 18.1666 1.83337 14.5102 1.83337 9.99992ZM14.3635 7.92721C14.6239 7.66687 14.6239 7.24476 14.3635 6.98441C14.1032 6.72406 13.6811 6.72406 13.4207 6.98441L9.82961 10.5755C9.53851 10.8666 9.3666 11.0365 9.22848 11.1419C9.17307 11.1842 9.13961 11.2029 9.1225 11.2107C9.1054 11.2029 9.07194 11.1842 9.01653 11.1419C8.87841 11.0365 8.7065 10.8666 8.4154 10.5755L7.13815 9.29825C6.8778 9.03791 6.45569 9.03791 6.19534 9.29825C5.93499 9.55861 5.93499 9.98071 6.19534 10.2411L7.50018 11.5459C7.75408 11.7999 7.98968 12.0355 8.20775 12.2019C8.44909 12.3861 8.74554 12.5469 9.1225 12.5469C9.49946 12.5469 9.79592 12.3861 10.0373 12.2019C10.2553 12.0355 10.4909 11.7999 10.7448 11.5459L14.3635 7.92721Z"
                                  fill="#047857"
                                />
                              </svg>
                            </div>
                            <h6 className="text-center text-gray-500 text-base font-normal leading-relaxed">
                              {new Date(event.createdAt).toLocaleString("en", {
                                timeZone: "Asia/Dhaka",
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </h6>
                          </div>
                        </li>
                      )
                    )}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-row gap-5 items-center">
            <FormField
              control={form.control}
              name="tracking_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="Tracking Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="cursor-pointer" type="submit">
              {isLoading ? <GlobalLoader /> : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
