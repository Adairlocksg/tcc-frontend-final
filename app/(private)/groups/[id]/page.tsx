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
import { getGroup, getGroupMembers, Group } from "@/lib/groups";
import {
  getGroupExpenses,
  RecurrenceType,
  RecurrenceTypeDescription,
} from "@/lib/expenses";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
  isWithinInterval,
  parseISO,
  startOfDay,
  addDays,
} from "date-fns";
import { CategoryList } from "@/components/category-list";
import { GroupMembers } from "@/components/group-members";
import { CategorySelect } from "@/components/category-select";
import { useQueryClient } from "@tanstack/react-query";
import { GroupLinkDialog } from "@/components/group-link-dialog";
import { useExpenseSummary } from "@/hooks/use-expenses-summary";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [group, setGroup] = useState<Group | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [customRange, setCustomRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const now = new Date();

  const [filterDates, setFilterDates] = useState<{ start: Date; end: Date }>({
    start: startOfMonth(now),
    end: endOfMonth(now),
  });

  const { data: expenses } = useExpenseSummary(
    groupId,
    filterDates.start.toISOString(),
    filterDates.end.toISOString(),
    selectedCategory === "all" ? null : selectedCategory
  );

  const periodOptions = [
    { value: "current", label: "Este mês" },
    { value: "previous", label: "Mês passado" },
    { value: "next", label: "Mês que vem" },
    { value: "custom", label: "Personalizado" },
  ];

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  useEffect(() => {
    if (selectedPeriod !== "custom") {
      const now = new Date();
      switch (selectedPeriod) {
        case "current":
          setFilterDates({
            start: startOfMonth(now),
            end: startOfMonth(addMonths(now, 1)),
          });
          break;
        case "previous":
          setFilterDates({
            start: startOfMonth(subMonths(now, 1)),
            end: startOfMonth(now),
          });
          break;
        case "next":
          setFilterDates({
            start: startOfMonth(addMonths(now, 1)),
            end: startOfMonth(addMonths(now, 2)),
          });
          break;
      }
    }
  }, [selectedPeriod]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupData] = await Promise.all([getGroup(groupId)]);

        setGroup(groupData);
      } catch (error) {
        toast.error("Falha ao carregar os dados do grupo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  const handleFavorite = async () => {
    if (!group) return;

    try {
      // await setFavoriteGroup(groupId);
      setGroup({ ...group, favorite: !group.favorite });
    } catch (error) {
      console.error("Failed to set favorite group:", error);
    }
  };

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
  const totalExpenses = expenses?.reduce(
    (sum, expense) => sum + expense.totalValue,
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
            Voltar
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
            <span className="text-sm font-medium">Período:</span>
          </div>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPeriod === "custom" && (
          <>
            <div className="mb-4 flex gap-2">
              <Input
                type="date"
                value={customRange?.start ?? ""}
                onChange={(e) =>
                  setCustomRange((prev) => ({
                    start: e.target.value,
                    end: prev?.end ?? "",
                  }))
                }
              />
              <Input
                type="date"
                value={customRange?.end ?? ""}
                onChange={(e) =>
                  setCustomRange((prev) => ({
                    start: prev?.start ?? "",
                    end: e.target.value,
                  }))
                }
              />
            </div>
            <Button
              size="sm"
              className="mb-4"
              disabled={!customRange?.start || !customRange?.end}
              onClick={() => {
                if (customRange?.start && customRange?.end) {
                  setFilterDates({
                    start: startOfDay(new Date(customRange.start)),
                    end: addDays(startOfDay(new Date(customRange.end)), 1),
                  });
                }
              }}
            >
              <Filter className="h-4 w-4" />
              Aplicar
            </Button>
          </>
        )}

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-teal-800/70 to-emerald-700/70 text-white">
            <CardContent className="p-3">
              <p className="text-xs font-medium">Total em despesas</p>
              <p className="text-xl font-bold">
                R$ {totalExpenses?.toFixed(2)}
              </p>
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
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
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
              Filtros
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-1"
              onClick={() =>
                router.push(
                  `/groups/${group.id}/expenses/new?admin=${group.admin}`
                )
              }
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

          {expenses?.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="mb-4 text-muted-foreground">
                Nenhuma despesa encontrada para esse período.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses?.map((expense) => (
                <Card key={expense.id} className="overflow-hidden">
                  <div className="flex items-start justify-between p-4">
                    <div className="flex gap-3">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {expense.userName}
                          </p>
                          {expense.isRecurring && (
                            <>
                              <span className="text-xs text-muted-foreground">
                                •
                              </span>
                              <Badge
                                variant="outline"
                                className="h-5 px-1 text-xs"
                              >
                                {
                                  RecurrenceTypeDescription[
                                    expense.recurrenceType
                                  ]
                                }
                                {expense.recurrenceType ===
                                  RecurrenceType.CUSTOM &&
                                  ` a cada ${expense.recurrencyInterval} dias`}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-medium">
                        Valor total: R$ {expense.totalValue.toFixed(2)}
                      </p>
                      <Badge className="mt-1" variant="secondary">
                        {expense.categoryName}
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
          </div>
          <GroupMembers groupId={groupId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
