"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Group, Loader2, Plus } from "lucide-react";
import { useCreateGroup } from "@/hooks/use-create-group";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GroupDto } from "@/lib/groups";

const createGroupSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
});

type CreateGroupForm = z.infer<typeof createGroupSchema>;
export default function NewGroupPage() {
  const router = useRouter();

  const { mutate: createGroup, isPending } = useCreateGroup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
  });

  function onSubmit(data: CreateGroupForm) {
    const dto: GroupDto = {
      name: data.name,
      description: data.description,
    };

    createGroup(dto);
  }

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

      <h1 className="mb-6 text-2xl font-bold">Crie um novo grupo</h1>

      <Card className="mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="pb-3">
            <div className="h-1 w-12 rounded-full bg-primary"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do grupo</Label>
              <Input
                id="name"
                placeholder="Ex. Casa, Viagem, Amigos"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Descreva o propósito desse grupo"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isPending} className="w-full">
              Criar grupo
              {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
