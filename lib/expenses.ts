// This is a mock implementation. In a real app, you would use a database.

import { api, ApiResponse, Id } from "./api";

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  userId: string;
  recurrence?: {
    type: "daily" | "weekly" | "monthly" | "custom";
    interval?: number;
  };
}

export interface ExpenseDto {
  value: number;
  description: string;
  beginDate: string;
  endDate: string | null;
  categoryId: string;
  groupId: string;
  userId: string | null;
  recurrence: RecurrenceType | null;
  recurrenceInterval: number;
  isRecurring: boolean;
}

export interface ExpenseSummary{
  id: string;
  totalValue: number;
  description: string;
  recurrenceType: RecurrenceType;
  isRecurring: boolean;
  userName: string;
  categoryName: string;
  recurrencyInterval: number;
}

export enum RecurrenceType {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
  YEARLY = 3,
  CUSTOM = 4,
}

export const RecurrenceTypeDescription: Record<RecurrenceType, string> = {
  [RecurrenceType.DAILY]: "Diário",
  [RecurrenceType.WEEKLY]: "Semanal",
  [RecurrenceType.MONTHLY]: "Mensal",
  [RecurrenceType.YEARLY]: "Anual",
  [RecurrenceType.CUSTOM]: "Personalizado",
};

export interface ExpenseSummaryDto {
  groupId: string;
  startDate: string;
  endDate: string;
}

export async function getGroupExpenses(groupId: string): Promise<any[]> {
  return [];
}

export async function getGroupExpensesByDateRange(
  groupId: string,
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  return [];
}

export async function getExpenseSummaryByGroup(dto: ExpenseSummaryDto) {
  const response = await api.get<ApiResponse<ExpenseSummary[]>>(
    `expenses/summaryByGroup`,
    {
      params: { ...dto },
    }
  );

  return response.data.content;
}

export async function createExpense(dto: ExpenseDto): Promise<string> {
  const response = await api.post<ApiResponse<Id>>(`expenses`, dto);

  return response.data.content.id;
}
