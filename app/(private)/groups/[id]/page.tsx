"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Filter, Plus, Star, Calendar } from "lucide-react";
import {
  getGroup,
  setFavoriteGroup,
  getGroupMembers,
  Group,
} from "@/lib/groups";
import { getGroupExpenses } from "@/lib/expenses";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { CategoryList } from "@/components/category-list";
import { GroupMembers } from "@/components/group-members";
import { CategorySelect } from "@/components/category-select";
import { useQueryClient } from "@tanstack/react-query";
import { GroupLinkDialog } from "@/components/group-link-dialog";

export default function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [allExpenses, setAllExpenses] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupData, expensesData, membersData] = await Promise.all([
          getGroup(groupId),
          getGroupExpenses(groupId),
          getGroupMembers(groupId),
        ]);

        setGroup(groupData);
        setAllExpenses(expensesData);
        setMembers(membersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  // Generate last 12 months for the filter
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy"),
    };
  });

  // Filter expenses by month
  useEffect(() => {
    if (allExpenses.length > 0) {
      const currentMonthStart = startOfMonth(new Date(selectedMonth));
      const currentMonthEnd = endOfMonth(new Date(selectedMonth));

      const filtered = allExpenses.filter((expense) => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, {
          start: currentMonthStart,
          end: currentMonthEnd,
        });
      });

      setExpenses(filtered);
    }
  }, [allExpenses, selectedMonth]);

  const handleFavorite = async () => {
    if (!group) return;

    try {
      await setFavoriteGroup(groupId);
      setGroup({ ...group, favorite: !group.favorite });
    } catch (error) {
      console.error("Failed to set favorite group:", error);
    }
  };

  const filteredExpenses =
    selectedCategory === "all"
      ? expenses
      : expenses.filter((expense) => expense.category.id === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!group) {
    router.push("/");
    return null;
  }

  // Calculate total expenses for the filtered month
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "categories") {
      queryClient.invalidateQueries({ queryKey: ["categories", group.id] });
    }
  };

  return (
    <div className="container pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pb-4 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-muted-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            {group.admin && (
              <GroupLinkDialog
                groupId={group.id}
                open={linkDialogOpen}
                setOpen={setLinkDialogOpen}
              />
            )}
            <button onClick={handleFavorite}>
              <Star
                className={`h-6 w-6 ${
                  group.favorite
                    ? "fill-amber-500 text-amber-500"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="text-sm text-muted-foreground">{group.description}</p>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Month:</span>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-teal-800/70 to-emerald-700/70 text-white">
            <CardContent className="p-3">
              <p className="text-xs font-medium">Total em despesas</p>
              <p className="text-xl font-bold">R$ {totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-sky-800/70 to-blue-700/70 text-white">
            <CardContent className="p-3">
              <p className="text-xs font-medium">Membros</p>
              <p className="text-xl font-bold">{group.members}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="mt-4">
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-1"
              onClick={() => router.push(`/groups/${group.id}/expenses/new`)}
            >
              <Plus className="h-4 w-4" />
              Nova despesa
            </Button>
          </div>

          {showFilters && (
            <div className="mb-4">
              <CategorySelect
                groupId={group.id}
                selectedCategory={selectedCategory}
                onChange={setSelectedCategory}
              />
            </div>
          )}

          {filteredExpenses.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="mb-4 text-muted-foreground">
                No expenses found for{" "}
                {format(new Date(selectedMonth), "MMMM yyyy")}
              </p>
              <Button
                onClick={() => router.push(`/groups/${groupId}/expenses/new`)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <Card key={expense.id} className="overflow-hidden">
                  <div className="flex items-start justify-between p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10 border-2 border-muted">
                        <AvatarFallback>
                          {expense.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {expense.user.name}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(expense.date), "MMM d, yyyy")}
                          </p>
                          {expense.recurrence && (
                            <>
                              <span className="text-xs text-muted-foreground">
                                •
                              </span>
                              <Badge
                                variant="outline"
                                className="h-5 px-1 text-xs"
                              >
                                {expense.recurrence.type === "daily" && "Daily"}
                                {expense.recurrence.type === "weekly" &&
                                  "Weekly"}
                                {expense.recurrence.type === "monthly" &&
                                  "Monthly"}
                                {expense.recurrence.type === "custom" &&
                                  `Every ${expense.recurrence.interval} days`}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-medium">
                        R$ {expense.amount.toFixed(2)}
                      </p>
                      <Badge className="mt-1" variant="secondary">
                        {expense.category.name}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">Categorias</h3>
            <Button
              size="sm"
              className="flex items-center gap-1"
              onClick={() => router.push(`/groups/${groupId}/categories/new`)}
            >
              <Plus className="h-4 w-4" />
              Nova categoria
            </Button>
          </div>
          <CategoryList groupId={groupId} />
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">Membros</h3>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => {}}
            >
              <Plus className="h-4 w-4" />
              Invite
            </Button>
          </div>
          <GroupMembers groupId={groupId} isAdmin={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
