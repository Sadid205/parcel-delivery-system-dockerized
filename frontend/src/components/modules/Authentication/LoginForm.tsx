import GlobalLoader from "@/components/Layout/GlobalLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import type { IError, ILoginResponse, IResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export default function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const loginSchema = z.object({
    email: z.email({ error: "Please enter a valid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 8 characters long" }),
  });
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const { setError } = form;
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const toastId = toast.loading("Login to your account...");
    try {
      const res = (await login(
        data
      ).unwrap()) as IResponse<ILoginResponse> | null;
      console.log(res);
      toast.success("Login Successful", { id: toastId });
      navigate("/");
    } catch (err) {
      const error = err as IError;
      toast.error(error.data?.message, { id: toastId });
      setError("email", { message: error.data?.message });
      console.log(error);
    }
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Link to="/public/register">Sign Up</Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="login-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jonedoe@gmail.com" {...field} />
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
                    <Input type="password" placeholder="********" {...field} />
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
          form="login-form"
          type="submit"
          className="w-full cursor-pointer"
        >
          {isLoading ? <GlobalLoader color="border-blue-700" /> : "Login"}
        </Button>
        <Link to="/public/forgot-password">Forgot Password?</Link>
      </CardFooter>
    </Card>
  );
}
