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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function ForgotPasswordForm() {
  const [forgotPasswordLink, { isLoading }] = useForgotPasswordMutation();
  const forgotPasswordSchema = z.object({
    email: z.email(),
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    const toastId = toast.loading("Sending reset link...");
    try {
      await forgotPasswordLink({ email: data.email }).unwrap();
      toast.success("Reset link sent! Please check your email.", {
        id: toastId,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to send reset link", { id: toastId });
    }
  };
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Please enter your email</CardTitle>
        <CardDescription>
          Enter your email below to reset your password
        </CardDescription>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jondoe@gmail.com" {...field} />
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
          {isLoading ? <GlobalLoader /> : "Send Reset Link"}
        </Button>
      </CardFooter>
    </Card>
  );
}
