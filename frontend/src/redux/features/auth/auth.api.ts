import { baseApi } from "@/redux/baseApi";
import type {
  IForgotPassword,
  ILogin,
  IRegister,
  IResetPassword,
  ISendOtp,
  IUserResponse,
  IVerifyOtp,
} from "@/types/auth.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<null, ILogin>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),
    register: builder.mutation<null, IRegister>({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    sendOtp: builder.mutation<null, ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
    verifyOtp: builder.mutation<null, IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
    forgotPassword: builder.mutation<null, IForgotPassword>({
      query: (userInfo) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data: userInfo,
      }),
    }),
    resetPassword: builder.mutation<null, IResetPassword>({
      query: (payload: { password: string; id: string }) => ({
        url: "/auth/reset-password",
        method: "POST",
        data: payload,
        headers: {
          id: payload.id,
        },
      }),
    }),
    userInfo: builder.query<IUserResponse, null>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useSendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useUserInfoQuery,
} = authApi;
