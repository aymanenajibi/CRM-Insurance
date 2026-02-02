import api from "../lib/api";
import { DashboardStatsResponse } from "../types/stats";

class StatsService {
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const response = await api.get<DashboardStatsResponse>("/stats/");
    return response.data;
  }
}

export const statsService = new StatsService();