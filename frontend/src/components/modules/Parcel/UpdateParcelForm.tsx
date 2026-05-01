import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { PARCEL_TYPES } from "@/types/parcel.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
export default function UpdateParcelForm() {
  const form = useForm<z.infer<typeof parcelCreateSchema>>({
    resolver: zodResolver(parcelCreateSchema),

    defaultValues: {
      receiver: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      weight: 0,
      parcel_type: "DOCUMENT",
    },
  });
  const onSubmit = (data: z.infer<typeof parcelCreateSchema>) => {
    console.log(data);
  };
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Create a parcel</CardTitle>
      </CardHeader>
      <CardContent>
        {" "}
        <Form {...form}>
          <form
            id="create-parcel"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
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
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          form="create-parcel"
          type="submit"
          className="cursor-pointer w-full"
        >
          Create Now
        </Button>
      </CardFooter>
    </Card>
  );
}
