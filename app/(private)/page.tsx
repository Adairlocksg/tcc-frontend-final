"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, TrendingDown, Users, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMainDashboard } from "@/hooks/use-main-dashboard";
import { StatCard } from "@/components/stat-card";
import { useRouter } from "next/navigation";
import { GroupDashboard } from "@/lib/dashboard";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useMainDashboard();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const favoriteGroup = dashboard?.groups.find((group) => group.favorite);
  const otherGroups = dashboard?.groups.filter((group) => !group.favorite);
  return (
    <div className="container space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus grupos</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <StatCard
          title="Despesas totais"
          value={dashboard?.totalCurrentMonth ?? 0}
          percentageChange={dashboard?.percentageChange ?? 0}
        />
      </div>

      <div className="space-y-6">
        {favoriteGroup && (
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              <span>Grupo favorito</span>
            </h2>
            <Link href={`/groups/${favoriteGroup.groupId}`}>
              <Card className="overflow-hidden border-2 border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
                <div className="h-2 w-full bg-primary"></div>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">
                          {favoriteGroup.name}
                        </h3>
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {favoriteGroup.description}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Users className="h-3 w-3" />{" "}
                          {favoriteGroup.membersCount}
                        </Badge>
                        <span className="text-sm font-medium">
                          R${" "}
                          {favoriteGroup.totalCurrentMonth.toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(
                          `/groups/${favoriteGroup.groupId}/expenses/new?admin=${favoriteGroup.admin}`
                        );
                      }}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Adicionar despesa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Other Groups</h2>
          <div className="space-y-4">
            {otherGroups?.map((group: GroupDashboard) => (
              <Link key={group.groupId} href={`/groups/${group.groupId}`}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <div className="h-1 w-full bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {group.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge
                          variant="outline"
                          className="mb-1 flex items-center gap-1"
                        >
                          <Users className="h-3 w-3" /> {group.membersCount}
                        </Badge>
                        <p className="text-sm font-medium">
                          R$
                          {group.totalCurrentMonth.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            <Link href="/groups/new">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="mb-2 rounded-full bg-primary/10 p-2">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-center text-sm font-medium">
                    Criar novo grupo
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
