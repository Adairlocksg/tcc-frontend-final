"use client";

import type React from "react";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  BanknoteIcon,
  ChevronLeft,
  CircleDollarSign,
  Loader2,
  Wallet2,
} from "lucide-react";
import { getGroupMembers } from "@/lib/groups";
import { CategorySelect } from "@/components/category-select";
import { ExpenseDto, RecurrenceType } from "@/lib/expenses";
import { useCreateExpense } from "@/hooks/use-create-expense";
import { MemberSelect } from "@/components/member-select";
import { toast } from "sonner";

export default function NewExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: groupId } = use(params);
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";
  const [category, setCategory] = useState("");
  const [member, setMember] = useState("");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recurrenceEndDateEnabled, setRecurrenceEndDateEnabled] =
    useState(false);

  const { mutate: createExpense, isPending } = useCreateExpense();
  const [recurrenceType, setRecurrenceType] = useState("monthly");
  const [customInterval, setCustomInterval] = useState(1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const recurrneceByType = {
      daily: RecurrenceType.DAILY,
      weekly: RecurrenceType.WEEKLY,
      monthly: RecurrenceType.MONTHLY,
      custom: RecurrenceType.CUSTOM,
    };

    if (!category) {
      toast.error("Por favor, selecione uma categoria.");
      return;
    }
    
    const dto: ExpenseDto = {
      value: Number.parseFloat(value.replace(/[^\d.-]/g, "")),
      description,
      beginDate: new Date().toISOString(),
      endDate: recurrenceEndDateEnabled
        ? new Date(recurrenceEndDate).toISOString()
        : null,
      categoryId: category,
      groupId,
      recurrence: recurrenceType
        ? recurrneceByType[recurrenceType as keyof typeof recurrneceByType]
        : null,
      recurrenceInterval: recurrenceType === "custom" ? customInterval : 0,
      userId: member || null,
      isRecurring,
    };

    createExpense(dto);
  };

  const formatCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value) {
      value = (Number.parseInt(value) / 100).toFixed(2);
      e.target.value = `R$ ${value}`;
    } else {
      e.target.value = "";
    }

    setValue(value);
  };

  const handleIsRecurringChange = (checked: boolean) => {
    setIsRecurring(checked);
    if (!checked) {
      setRecurrenceType("monthly");
      setRecurrenceEndDateEnabled(false);
      setRecurrenceEndDate("");
      setCustomInterval(1);
    }
  };

  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-muted-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar
        </button>
      </div>

      <h1 className="mb-2 text-2xl font-bold">Adicionar despesa</h1>

      <Card className="mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-3">
            <div className="h-1 w-12 rounded-full bg-primary"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                name="amount"
                placeholder="R$ 0.00"
                onChange={formatCurrency}
                className="text-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a despesa"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <CategorySelect
                placeholder="Selecione uma categoria"
                groupId={groupId}
                selectedCategory={category}
                onChange={setCategory}
                includeAllOption={false}
              />
            </div>
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="user">Pago por</Label>
                <MemberSelect
                  placeholder="Selecione um membro do grupo"
                  groupId={groupId}
                  selectedMember={member}
                  onChange={setMember}
                  includeAllOption={false}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={handleIsRecurringChange}
              />
              <Label htmlFor="recurring">Despesa recorrente</Label>
            </div>
            {isRecurring && (
              <>
                <div className="space-y-4 rounded-md border p-4">
                  <RadioGroup
                    value={recurrenceType}
                    onValueChange={setRecurrenceType}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">Diária</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">Semanal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">Mesnal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom">Personalizada</Label>
                    </div>
                  </RadioGroup>
                  {recurrenceType === "custom" && (
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="interval">A cada</Label>
                      <Input
                        id="interval"
                        type="number"
                        min="1"
                        className="w-20"
                        value={customInterval}
                        onChange={(e) =>
                          setCustomInterval(Number.parseInt(e.target.value))
                        }
                      />
                      <span>dias</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="endDateSwitch"
                      checked={recurrenceEndDateEnabled}
                      onCheckedChange={setRecurrenceEndDateEnabled}
                    />
                    <Label htmlFor="endDate">Possui data final</Label>
                  </div>
                  <Input
                    id="endDate"
                    type="date"
                    disabled={!recurrenceEndDateEnabled}
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    className="w-64"
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isPending} className="w-full">
              Adicionar despesa
              {isPending ? <Loader2 className="animate-spin" /> : <Wallet2 />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
