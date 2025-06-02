import { api, ApiResponse } from "./api";

export interface GroupDashboard {
  groupId: string;
  name: string;
  description: string;
  membersCount: number;
  totalCurrentMonth: number;
  totalPreviousMonth: number;
  percentageChange: number;
  favorite: boolean;
  admin: boolean;
}

export interface MainDashboard {
  totalCurrentMonth: number;
  totalPreviousMonth: number;
  percentageChange: number;
  groups: GroupDashboard[];
}

export async function getMainDashboard(): Promise<MainDashboard> {
  const response = await api.get<ApiResponse<MainDashboard>>(`dashboards/main`);

  return response.data.content;
}
