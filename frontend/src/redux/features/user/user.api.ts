import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allUsers: builder.query({
      query: ({ searchTerm, page, limit }) => {
        let url = `user/all-users`;
        const params = new URLSearchParams();
        if (searchTerm && searchTerm.trim() !== "") {
          params.append("searchTerm", searchTerm);
        }
        if (page != null) params.append("page", page.toString());
        if (limit != null) params.append("limit", limit.toString());
        if ([...params].length > 0) {
          url += `?${params.toString()}`;
        }
        return { url, method: "GET" };
      },
      providesTags: ["USER"],
    }),
    updateUser: builder.mutation<
      null,
      {
        id: string;
        userData: {
          role: "ADMIN" | "DELIVERY_MAN" | "USER" | "SUPER_ADMIN";
          isActive: "ACTIVE" | "INACTIVE" | "BLOCKED";
        };
      }
    >({
      query: ({ id, userData }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data: userData,
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const { useLazyAllUsersQuery, useUpdateUserMutation } = userApi;
