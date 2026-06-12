import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type {
  AuthUser,
  Category,
  Invoice,
  PaymentMethod,
  Product,
  Role,
  Sale,
  SalesSummary,
  Shop,
  TopProduct,
  User,
  UserStatus,
} from "@/lib/types";
import type { RootState } from "./index";
import { clearCredentials } from "./auth-slice";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    // Only clear credentials if the user was actually logged in —
    // prevents redirect loop when unauthenticated requests get a 401
    const token = (api.getState() as RootState).auth.token;
    if (token) api.dispatch(clearCredentials());
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "User",
    "Category",
    "Product",
    "Sale",
    "Invoice",
    "Report",
    "Shop",
  ],
  endpoints: (build) => ({
    // --- Shops (super_admin only) ---
    getShops: build.query<Shop[], void>({
      query: () => "/shops",
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({ type: "Shop" as const, id: s.id })),
              { type: "Shop", id: "LIST" },
            ]
          : [{ type: "Shop", id: "LIST" }],
    }),
    createShop: build.mutation<
      Shop,
      { name: string; address?: string; phone?: string; logoUrl?: string }
    >({
      query: (body) => ({ url: "/shops", method: "POST", body }),
      invalidatesTags: [{ type: "Shop", id: "LIST" }],
    }),
    updateShop: build.mutation<
      Shop,
      {
        id: string;
        name?: string;
        address?: string;
        phone?: string;
        logoUrl?: string;
        isActive?: boolean;
      }
    >({
      query: ({ id, ...body }) => ({ url: `/shops/${id}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Shop", id: arg.id },
        { type: "Shop", id: "LIST" },
      ],
    }),
    deleteShop: build.mutation<void, string>({
      query: (id) => ({ url: `/shops/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Shop", id: "LIST" }],
    }),

    // --- Auth ---
    login: build.mutation<
      { accessToken: string; user: AuthUser },
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    me: build.query<AuthUser, void>({
      query: () => "/auth/me",
      transformResponse: (raw: AuthUser & { sub?: string }) => ({
        id: raw.sub ?? raw.id,
        email: raw.email,
        name: (raw as AuthUser).name ?? raw.email,
        role: raw.role,
        shopId: raw.shopId ?? null,
      }),
    }),

    // --- Users ---
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: (result) =>
        result
          ? [
              ...result.map((u) => ({ type: "User" as const, id: u.id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    createUser: build.mutation<
      User,
      {
        name: string;
        email: string;
        password: string;
        role: Role;
        status?: UserStatus;
      }
    >({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: build.mutation<
      User,
      {
        id: string;
        name?: string;
        email?: string;
        password?: string;
        role?: Role;
        status?: UserStatus;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "User", id: arg.id },
        { type: "User", id: "LIST" },
      ],
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // --- Categories ---
    getCategories: build.query<Category[], void>({
      query: () => "/categories",
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Category" as const, id: c.id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
    createCategory: build.mutation<
      Category,
      { name: string; description?: string }
    >({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: build.mutation<
      Category,
      { id: string; name?: string; description?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Category", id: arg.id },
        { type: "Category", id: "LIST" },
      ],
    }),
    deleteCategory: build.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // --- Products ---
    getProducts: build.query<Product[], void>({
      query: () => "/products",
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Product" as const, id: p.id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getLowStockProducts: build.query<Product[], void>({
      query: () => "/products/low-stock",
      providesTags: [{ type: "Product", id: "LOW_STOCK" }],
    }),
    createProduct: build.mutation<
      Product,
      {
        name: string;
        sku: string;
        categoryId: string;
        price: number;
        cost?: number;
        quantity?: number;
        lowStockLimit?: number;
      }
    >({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "LOW_STOCK" },
      ],
    }),
    updateProduct: build.mutation<
      Product,
      {
        id: string;
        name?: string;
        sku?: string;
        categoryId?: string;
        price?: number;
        cost?: number;
        quantity?: number;
        lowStockLimit?: number;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Product", id: arg.id },
        { type: "Product", id: "LIST" },
        { type: "Product", id: "LOW_STOCK" },
      ],
    }),
    adjustStock: build.mutation<
      Product,
      { id: string; delta: number; reason?: string }
    >({
      query: ({ id, delta, reason }) => ({
        url: `/products/${id}/stock`,
        method: "POST",
        body: { delta, reason },
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Product", id: arg.id },
        { type: "Product", id: "LIST" },
        { type: "Product", id: "LOW_STOCK" },
      ],
    }),
    deleteProduct: build.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "LOW_STOCK" },
      ],
    }),

    // --- Sales (POS) ---
    checkout: build.mutation<
      Sale,
      {
        items: { productId: string; quantity: number }[];
        paymentMethod: PaymentMethod;
        customerName?: string;
        discount?: number;
        tax?: number;
      }
    >({
      query: (body) => ({ url: "/sales/checkout", method: "POST", body }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "LOW_STOCK" },
        { type: "Sale", id: "LIST" },
        { type: "Invoice", id: "LIST" },
        { type: "Report", id: "ALL" },
      ],
    }),

    // --- Invoices ---
    getInvoices: build.query<Invoice[], void>({
      query: () => "/invoices",
      providesTags: (result) =>
        result
          ? [
              ...result.map((i) => ({ type: "Invoice" as const, id: i.id })),
              { type: "Invoice", id: "LIST" },
            ]
          : [{ type: "Invoice", id: "LIST" }],
    }),

    // --- Reports ---
    getDailyReport: build.query<SalesSummary, void>({
      query: () => "/reports/daily",
      providesTags: [{ type: "Report", id: "ALL" }],
    }),
    getWeeklyReport: build.query<SalesSummary, void>({
      query: () => "/reports/weekly",
      providesTags: [{ type: "Report", id: "ALL" }],
    }),
    getMonthlyReport: build.query<SalesSummary, void>({
      query: () => "/reports/monthly",
      providesTags: [{ type: "Report", id: "ALL" }],
    }),
    getSummaryReport: build.query<SalesSummary, { from: string; to: string }>({
      query: ({ from, to }) => `/reports/summary?from=${from}&to=${to}`,
      providesTags: [{ type: "Report", id: "ALL" }],
    }),
    getTopProducts: build.query<
      TopProduct[],
      { from: string; to: string; limit?: number }
    >({
      query: ({ from, to, limit = 10 }) =>
        `/reports/top-products?from=${from}&to=${to}&limit=${limit}`,
      providesTags: [{ type: "Report", id: "ALL" }],
    }),
  }),
});

export const {
  useGetShopsQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
  useLoginMutation,
  useMeQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductsQuery,
  useGetLowStockProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useAdjustStockMutation,
  useDeleteProductMutation,
  useCheckoutMutation,
  useGetInvoicesQuery,
  useGetDailyReportQuery,
  useGetWeeklyReportQuery,
  useGetMonthlyReportQuery,
  useGetSummaryReportQuery,
  useGetTopProductsQuery,
} = api;
