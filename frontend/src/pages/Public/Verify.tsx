import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/auth.api";
import type { IError } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
export default function Verify() {
  const location = useLocation();
  const [email] = useState(location.state);
  const [confirmed, setConfirmed] = useState(false);
  const [timer, setTimer] = useState(0);
  const [sendOtp] = useSendOtpMutation();
  const navigate = useNavigate();
  const [verifyOtp] = useVerifyOtpMutation();
  console.log(email);
  const VerifySchema = z.object({
    pin: z
      .string()
      .min(6, { message: "Your one-time password must be 6 digits" }),
  });
  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
  });
  const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
    const toastId = toast.loading("Verifying OTP...");
    const userInfo = {
      email: email.email,
      otp: data.pin,
    };
    try {
      const res = await verifyOtp(userInfo).unwrap();
      console.log(res);
      toast.success("OTP verified successfully", { id: toastId });
      navigate("/public/login");
    } catch (err) {
      console.log(err);
      const error = err as IError;
      toast.error(error?.data?.message ?? "Something went wrong", {
        id: toastId,
      });
    }
    console.log(userInfo);
  };

  useEffect(() => {
    if (!email || !confirmed) {
      return;
    }
    const timerId = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      console.log("tic");
    }, 1000);
    return () => clearInterval(timerId);
  }, [confirmed, email]);
  const handleSendOtp = async () => {
    const toastId = toast.loading("Sending OTP...");
    try {
      toast.loading("Sending OTP...", { id: toastId });
      const res = await sendOtp({ email: email.email }).unwrap();
      console.log(res);
      toast.success("OTP sent successfully", { id: toastId });
      setConfirmed(true);
      setTimer(180);
    } catch (err) {
      const error = err as IError;
      console.log(error);
      toast.error(error?.data?.message ?? "Failed to send OTP", {
        id: toastId,
      });
      if (error?.data?.message === "User Already Verified") {
        navigate("/public/login");
      }
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {confirmed ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Verify your account</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="otp-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="">
                        <Button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={timer !== 0}
                          variant="link"
                          className={cn("p-0 m-0", {
                            "cursor-pointer": timer === 0,
                            "text-gray-500": timer !== 0,
                          })}
                        >
                          Resend OTP
                        </Button>
                        :{timer} s
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end ">
            <Button className="cursor-pointer" form="otp-form" type="submit">
              Submit
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Verify your email address</CardTitle>
            <CardDescription>
              We will send you an OTP at <br />
              {email?.email}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleSendOtp}
              className="w-[300px] cursor-pointer"
            >
              Confirm
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
