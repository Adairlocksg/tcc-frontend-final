"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  percentageChange: number;
}

export function StatCard({ title, value, percentageChange }: StatCardProps) {
  const isPositive = percentageChange >= 0;

  const Icon = isPositive ? TrendingUp : TrendingDown;
  const iconColor = isPositive ? "text-red-300" : "text-emerald-300";
  const gradientFromColor = isPositive
    ? "from-rose-800/70"
    : "from-emerald-800/70";
  const gradientToColor = isPositive ? "to-pink-700/70" : "to-emerald-700/70";

  return (
    <Card
      className={`bg-gradient-to-br ${gradientFromColor} ${gradientToColor} text-white`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{title}</p>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <p className="mt-2 text-2xl font-bold">
          R${" "}
          {value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="mt-1 text-xs opacity-80">
          {isPositive ? "+" : ""}
          {percentageChange.toFixed(1)}% comparado ao mês passado
        </p>
      </CardContent>
    </Card>
  );
}
