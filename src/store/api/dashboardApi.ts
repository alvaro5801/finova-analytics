import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ActiveUsersResponse,
  AuthResponse,
  AuthorData,
  BankInstitutionData,
  BankSummaryData,
  BankTransactionData,
  ConnectResultData,
  IntegrationsResponse,
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
  tagTypes: ["Stats", "Projects", "Orders", "Authors", "Invoices", "Integrations"],
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
    getIntegrations: builder.query<IntegrationsResponse, void>({
      query: () => "/integrations",
      transformResponse: (res: { data: IntegrationsResponse }) => res.data,
      providesTags: ["Integrations"],
    }),
    getBankInstitutions: builder.query<BankInstitutionData[], void>({
      query: () => "/integrations/institutions",
      transformResponse: (res: { data: BankInstitutionData[] }) => res.data,
    }),
    getBankSummary: builder.query<BankSummaryData | null, void>({
      query: () => "/integrations/summary",
      transformResponse: (res: { data: BankSummaryData | null }) => res.data,
      providesTags: ["Integrations"],
    }),
    getBankTransactions: builder.query<BankTransactionData[], void>({
      query: () => "/integrations/transactions",
      transformResponse: (res: { data: BankTransactionData[] }) => res.data,
      providesTags: ["Integrations"],
    }),
    createConnectToken: builder.mutation<{ mode: string; connectToken: string }, void>({
      query: () => ({ url: "/integrations/connect-token", method: "POST" }),
      transformResponse: (res: { data: { mode: string; connectToken: string } }) => res.data,
    }),
    authorizeDemoBank: builder.mutation<{ itemId: string }, { connectToken: string; institutionId: string }>({
      query: (body) => ({ url: "/integrations/demo/authorize", method: "POST", body }),
      transformResponse: (res: { data: { itemId: string } }) => res.data,
    }),
    createBankConnection: builder.mutation<ConnectResultData, { itemId: string }>({
      query: (body) => ({ url: "/integrations/connections", method: "POST", body }),
      transformResponse: (res: { data: ConnectResultData }) => res.data,
      invalidatesTags: ["Integrations"],
    }),
    syncBankConnection: builder.mutation<{ accounts: number; imported: number }, number>({
      query: (id) => ({ url: `/integrations/connections/${id}/sync`, method: "POST" }),
      transformResponse: (res: { data: { accounts: number; imported: number } }) => res.data,
      invalidatesTags: ["Integrations"],
    }),
    deleteBankConnection: builder.mutation<{ id: number }, number>({
      query: (id) => ({ url: `/integrations/connections/${id}`, method: "DELETE" }),
      transformResponse: (res: { data: { id: number } }) => res.data,
      invalidatesTags: ["Integrations"],
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
  useGetIntegrationsQuery,
  useGetBankInstitutionsQuery,
  useGetBankTransactionsQuery,
  useGetBankSummaryQuery,
  useCreateConnectTokenMutation,
  useAuthorizeDemoBankMutation,
  useCreateBankConnectionMutation,
  useSyncBankConnectionMutation,
  useDeleteBankConnectionMutation,
  useSignInMutation,
  useSignUpMutation,
} = dashboardApi;
