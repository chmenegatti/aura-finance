import { api } from "./api";
import type { ApiResponseSuccess } from "@/types/api";
import type {
  DashboardChartsDTO,
  DashboardSummaryDTO,
} from "@/types/dashboard";

export const dashboardService = {
  async getSummary(params?: { startDate?: string; endDate?: string }): Promise<DashboardSummaryDTO> {
    const { data } = await api.get<ApiResponseSuccess<DashboardSummaryDTO>>(
      "/dashboard/summary",
      { params }
    );
    return data.data;
  },

  async getCharts(params?: { startDate?: string; endDate?: string }): Promise<DashboardChartsDTO> {
    const { data } = await api.get<ApiResponseSuccess<DashboardChartsDTO>>(
      "/dashboard/charts",
      { params }
    );
    return data.data;
  },
};
