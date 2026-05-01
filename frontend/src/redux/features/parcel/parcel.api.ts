import { baseApi } from "@/redux/baseApi";
import type { ICreateParcel, IUpdateParcel } from "@/types/parcel.type";

export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createParcel: builder.mutation<null, ICreateParcel>({
      query: (parcelInfo) => ({
        url: "/parcel",
        method: "POST",
        data: parcelInfo,
      }),
    }),
    assignParcel: builder.mutation<
      null,
      { id: string; tracking_number: string }
    >({
      query: ({ id, tracking_number }) => ({
        url: `/parcel/assign/${id}`,
        method: "POST",
        data: { tracking_number },
      }),
    }),
    updateParcel: builder.mutation<
      null,
      { id: string; parcelInfo: IUpdateParcel }
    >({
      query: ({ id, parcelInfo }) => ({
        url: `/parcel/${id}`,
        method: "PATCH",
        data: parcelInfo,
      }),
    }),

    updateParcelStatus: builder.mutation<
      null,
      {
        tracking_number: string;
        parcel_status: {
          status:
            | "REQUESTED"
            | "APPROVED"
            | "DISPATCHED"
            | "IN_TRANSIT"
            | "DELIVERED"
            | "CANCELLED"
            | "BLOCKED"
            | "RETURNED"
            | "RESCHEDULED";
          paid_status: "PAID" | "UNPAID";
          delivery_date: string;
        };
      }
    >({
      query: ({ tracking_number, parcel_status }) => ({
        url: `/parcel/update-status/${tracking_number}`,
        method: "PATCH",
        data: parcel_status,
      }),
      invalidatesTags: ["PARCEL"],
    }),
    getHistory: builder.query({
      query: ({ searchTerm, page, limit }) => {
        let url = `/parcel/history`;

        const params = new URLSearchParams();
        if (searchTerm && searchTerm.trim() !== "")
          params.append("searchTerm", searchTerm);
        if (page != null) params.append("page", page.toString());
        if (limit != null) params.append("limit", limit.toString());
        if ([...params].length > 0) {
          url += `?${params.toString()}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["PARCEL"],
    }),
    getIncomingParcel: builder.query({
      query: ({ searchTerm, page, limit }) => {
        let url = `/parcel/incoming-parcel`;

        const params = new URLSearchParams();
        if (searchTerm && searchTerm.trim() !== "")
          params.append("searchTerm", searchTerm);
        if (page != null) params.append("page", page.toString());
        if (limit != null) params.append("limit", limit.toString());
        if ([...params].length > 0) {
          url += `?${params.toString()}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["PARCEL"],
    }),
    getParcel: builder.query({
      query: ({ searchTerm, page, limit }) => {
        let url = `/parcel`;

        const params = new URLSearchParams();
        if (searchTerm && searchTerm.trim() !== "")
          params.append("searchTerm", searchTerm);
        if (page != null) params.append("page", page.toString());
        if (limit != null) params.append("limit", limit.toString());
        if ([...params].length > 0) {
          url += `?${params.toString()}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["PARCEL"],
    }),
    getAssignedParcel: builder.query({
      query: ({ searchTerm, page, limit }) => {
        let url = `/parcel/assigned-parcel`;

        const params = new URLSearchParams();
        if (searchTerm && searchTerm.trim() !== "")
          params.append("searchTerm", searchTerm);
        if (page != null) params.append("page", page.toString());
        if (limit != null) params.append("limit", limit.toString());
        if ([...params].length > 0) {
          url += `?${params.toString()}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["PARCEL"],
    }),
    cancelParcel: builder.mutation({
      query: (tracking_number: string) => ({
        url: `/parcel/cancel/${tracking_number}`,
        method: "GET",
      }),
    }),
    sendParcelOtp: builder.mutation({
      query: (data: { tracking_number: string }) => ({
        url: `/parcel/send-otp`,
        data,
        method: "POST",
      }),
    }),
    verifyParcelOtp: builder.mutation({
      query: (data: { tracking_number: string; otp: string }) => ({
        url: `/parcel/verify-otp`,
        data,
        method: "POST",
      }),
      invalidatesTags: ["PARCEL"],
    }),
    trackParcel: builder.query({
      query: (tracking_number: string) => ({
        url: `/parcel/${tracking_number}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateParcelMutation,
  useUpdateParcelMutation,
  useGetHistoryQuery,
  useLazyGetHistoryQuery,
  useCancelParcelMutation,
  useLazyTrackParcelQuery,
  useGetParcelQuery,
  useLazyGetParcelQuery,
  useUpdateParcelStatusMutation,
  useAssignParcelMutation,
  useLazyGetAssignedParcelQuery,
  useSendParcelOtpMutation,
  useVerifyParcelOtpMutation,
  useLazyGetIncomingParcelQuery,
} = parcelApi;
