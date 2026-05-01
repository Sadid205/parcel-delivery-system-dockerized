import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import GlobalLoader from "@/components/Layout/GlobalLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export default function ResetPasswordForm() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const id = queryParams.get("id");
  const resetPasswordSchema = z
    .object({
      password: z
        .string({ error: "Please enter your new password" })
        .min(8)
        .max(32),
      confirmPassword: z
        .string({ error: "Please enter your new password" })
        .min(8)
        .max(32),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match",
    });

  useEffect(() => {
    if (!id || !token) {
      return;
    }
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000);
    Cookies.set("accessToken", token, {
      expires: expiryDate,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  }, [id, token]);
  console.log(token, id);

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    const toastId = toast.loading("Changing password...");
    try {
      const res = await resetPassword({
        password: data.password,
        id: id!,
      }).unwrap();
      console.log(res);
      toast.success("Successfully reset your password please login", {
        id: toastId,
      });
      navigate("/public/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to reset your password", { id: toastId });
      navigate("/public/forgot-password");
    }
  };
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Please enter your new password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="forgot-password"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
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
      <CardFooter className="flex justify-end">
        <Button
          form="forgot-password"
          type="submit"
          className="w-full m-auto cursor-pointer"
        >
          {isLoading ? <GlobalLoader /> : "Reset Password"}
        </Button>
      </CardFooter>
    </Card>
  );
}
