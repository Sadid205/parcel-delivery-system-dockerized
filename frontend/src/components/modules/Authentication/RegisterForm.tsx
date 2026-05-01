import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import GlobalLoader from "@/components/Layout/GlobalLoader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
const registerSchema = z
  .object({
    name: z
      .string({ error: "Name is required" })
      .min(3, { error: "Name is too short" })
      .max(32, { error: "Name is too long" })
      .regex(/^[^0-9]+$/, { error: "Name must contain only letters" }),
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string({ error: "Password is required" })
      .min(8, { error: "Password is too short" })
      .max(32, { error: "Password is too long" }),
    confirmPassword: z
      .string({ error: "Confirm Password is required" })
      .min(8, { error: "Password is too short" })
      .max(32, { error: "Password is too long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: undefined,
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
    },
  });
  const { setError } = form;
  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    // console.log(data);
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    const toastId = toast.loading("Creating your account...");
    try {
      const result = await register(userInfo).unwrap();
      toast.success("Account created successfully", { id: toastId });
      console.log(result);
      navigate("/public/verify", { state: { email: data.email } });
    } catch (error) {
      console.log(error);
      const err = error as {
        data?: {
          success: string;
          message: string;
          errorSources?: { path: string; message: string }[];
        };
      };
      err?.data?.errorSources?.forEach((e) => {
        setError(e.path as keyof z.infer<typeof registerSchema>, {
          message: e.message,
        });
        console.log(
          e.path === "email" &&
            e.message === `email '${data.email}' Is Already Taken`,
        );
        if (
          e.path === "email" &&
          e.message === `email '${data.email}' Is Already Taken`
        ) {
          toast.error(`${e.message}`, { id: toastId });
          navigate("/public/verify", { state: { email: data.email } });
        }
      });
      toast.error(err?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardAction>
          <Button variant="link"> Already have an account ? Login</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="signup-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jone doe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jone@gmail.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          form="signup-form"
          className="w-full cursor-pointer"
        >
          {isLoading ? <GlobalLoader color="border-blue-500" /> : "Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  );
}
