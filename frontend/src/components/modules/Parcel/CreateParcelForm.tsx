import GlobalLoader from "@/components/Layout/GlobalLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateParcelMutation } from "@/redux/features/parcel/parcel.api";
import { PARCEL_TYPES, type ICreateParcel } from "@/types/parcel.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const parcelCreateSchema = z.object({
  receiver: z.object({
    name: z.string({ error: "Please input a string" }).min(5).max(30),
    email: z.email(),
    phone: z
      .string()
      .regex(
        /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/,
        "Invalid Bangladeshi phone number"
      ),
    address: z.string({ error: "Please input a string" }).min(5).max(30),
  }),
  weight: z.number().min(1),
  parcel_type: z.enum(
    PARCEL_TYPES.map((p) => p.value) as [string, ...string[]]
  ),
  description: z.string().optional(),
});
export default function CreateParcelForm() {
  const [create, { isLoading, isError }] = useCreateParcelMutation();
  const form = useForm<z.infer<typeof parcelCreateSchema>>({
    resolver: zodResolver(parcelCreateSchema),

    defaultValues: {
      receiver: {
        name: undefined,
        email: undefined,
        phone: undefined,
        address: undefined,
      },
      weight: undefined,
      parcel_type: "DOCUMENT",
    },
  });
  const onSubmit = async (data: z.infer<typeof parcelCreateSchema>) => {
    const toastId = toast.loading("Parcel is creating....");
    try {
      const parcelData = {
        receiver: {
          name: data.receiver.name,
          email: data.receiver.email,
          phone: data.receiver.phone,
          address: data.receiver.address,
        },
        weight: data.weight,
        parcel_type: data.parcel_type,
      } as ICreateParcel;
      const res = await create(parcelData).unwrap();
      toast.success(
        "Parcel Has Been Successfully Created And Is Now Being Processed.",
        { id: toastId }
      );
      console.log(res);
      form.reset({
        receiver: {
          name: "",
          email: "",
          phone: "",
          address: "",
        },
        weight: 0,
        parcel_type: "DOCUMENT",
      });
    } catch (err) {
      console.log(err);
      console.log(isError);
      toast.error("failed!", { id: toastId });
    }
  };
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Create a parcel</CardTitle>
      </CardHeader>
      <CardContent>
        {" "}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="md:flex gap-6">
              <FormField
                control={form.control}
                name="receiver.name"
                render={({ field }) => (
                  <FormItem className="w-full py-3">
                    <FormLabel>Receiver's Name:</FormLabel>
                    <FormControl>
                      <Input placeholder="jone doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiver.email"
                render={({ field }) => (
                  <FormItem className="w-full  py-3">
                    <FormLabel>Receiver's Email:</FormLabel>
                    <FormControl>
                      <Input placeholder="jonedoe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:flex gap-6">
              <FormField
                control={form.control}
                name="receiver.phone"
                render={({ field }) => (
                  <FormItem className="w-full py-3">
                    <FormLabel>Receiver's Phone:</FormLabel>
                    <FormControl>
                      <Input placeholder="+8801743432436" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiver.address"
                render={({ field }) => (
                  <FormItem className="w-full  py-3">
                    <FormLabel>Receiver's Address:</FormLabel>
                    <FormControl>
                      <Input placeholder="Dhaka,Mohakhali" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:flex gap-6">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem className="w-full py-3">
                    <FormLabel>Product Weight In Gram:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        type="number"
                        placeholder="50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parcel_type"
                render={({ field }) => (
                  <FormItem className="w-full  py-3">
                    <FormLabel>Parcel Type:</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Parcel Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PARCEL_TYPES.map((type, index) => (
                            <SelectItem value={`${type.value}`} key={index}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full  py-3">
                    <FormLabel>Parcel Description:</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex min-w-full">
              <Button type="submit" className="w-full cursor-pointer">
                {isLoading ? <GlobalLoader /> : "Create Now"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
