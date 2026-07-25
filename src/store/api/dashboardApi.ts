import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ActiveUsersResponse,
  AuthResponse,
  AuthorData,
  InvoiceData,
  OrderEventData,
  ProjectData,
  ReferralResponse,
  SalesPointData,
  SatisfactionRateData,
  StatCardData,
} from "@/types/dashboard";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Stats", "Projects", "Orders", "Authors", "Invoices"],
  endpoints: (builder) => ({
    getStats: builder.query<StatCardData[], void>({
      query: () => "/stats",
      transformResponse: (res: { data: StatCardData[] }) => res.data,
      providesTags: ["Stats"],
    }),
    getSalesOverview: builder.query<SalesPointData[], void>({
      query: () => "/sales-overview",
      transformResponse: (res: { data: SalesPointData[] }) => res.data,
    }),
    getActiveUsers: builder.query<ActiveUsersResponse, void>({
      query: () => "/active-users",
      transformResponse: (res: { data: ActiveUsersResponse }) => res.data,
    }),
    getSatisfaction: builder.query<SatisfactionRateData, void>({
      query: () => "/satisfaction",
      transformResponse: (res: { data: SatisfactionRateData }) => res.data,
    }),
    getReferral: builder.query<ReferralResponse, void>({
      query: () => "/referral",
      transformResponse: (res: { data: ReferralResponse }) => res.data,
    }),
    getProjects: builder.query<ProjectData[], void>({
      query: () => "/projects",
      transformResponse: (res: { data: ProjectData[] }) => res.data,
      providesTags: ["Projects"],
    }),
    getOrders: builder.query<OrderEventData[], void>({
      query: () => "/orders",
      transformResponse: (res: { data: OrderEventData[] }) => res.data,
      providesTags: ["Orders"],
    }),
    getAuthors: builder.query<AuthorData[], void>({
      query: () => "/authors",
      transformResponse: (res: { data: AuthorData[] }) => res.data,
      providesTags: ["Authors"],
    }),
    getInvoices: builder.query<InvoiceData[], void>({
      query: () => "/invoices",
      transformResponse: (res: { data: InvoiceData[] }) => res.data,
      providesTags: ["Invoices"],
    }),
    signIn: builder.mutation<AuthResponse, SignInPayload>({
      query: (body) => ({ url: "/auth/sign-in", method: "POST", body }),
      transformResponse: (res: { data: AuthResponse }) => res.data,
    }),
    signUp: builder.mutation<AuthResponse, SignUpPayload>({
      query: (body) => ({ url: "/auth/sign-up", method: "POST", body }),
      transformResponse: (res: { data: AuthResponse }) => res.data,
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetSalesOverviewQuery,
  useGetActiveUsersQuery,
  useGetSatisfactionQuery,
  useGetReferralQuery,
  useGetProjectsQuery,
  useGetOrdersQuery,
  useGetAuthorsQuery,
  useGetInvoicesQuery,
  useSignInMutation,
  useSignUpMutation,
} = dashboardApi;
