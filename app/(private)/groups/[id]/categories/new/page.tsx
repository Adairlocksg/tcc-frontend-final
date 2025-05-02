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
import { ChevronLeft, Loader2, Plus } from "lucide-react";
import { CategoryDto, createCategory } from "@/lib/categories";
import { getGroup } from "@/lib/groups";
import { useEffect } from "react";
import { z } from "zod";
import { useCreateCategory } from "@/hooks/use-create-category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface NewCategoryPageProps {
  params: {
    id: string;
  };
}
const createCategorySchema = z.object({
  description: z.string().min(1, "Descrição obrigatória"),
});

type CreateCategoryForm = z.infer<typeof createCategorySchema>;
export default function NewCategoryPage({ params }: NewCategoryPageProps) {
  const router = useRouter();
  const { mutate: createCategory, isPending } = useCreateCategory();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryForm>({
    resolver: zodResolver(createCategorySchema),
  });

  function onSubmit(data: CreateCategoryForm) {
    const dto: CategoryDto = {
      description: data.description,
    };

    createCategory({ id: params.id, dto });
  }

  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-muted-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </button>
      </div>

      <h1 className="mb-2 text-2xl font-bold">Criar categoria</h1>
      <Card className="mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="pb-3">
            <div className="h-1 w-12 rounded-full bg-primary"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="ex. Comida, Transporte, Entretenimento"
                {...register("description")}
              />
            </div>
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full">
              Criar categoria
              {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
