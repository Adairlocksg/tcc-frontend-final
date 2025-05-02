"use client";

import { useCategories } from "@/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  groupId: string;
  selectedCategory: string;
  onChange: (categoryId: string) => void;
  includeAllOption?: boolean;
}

export function CategorySelect({
  groupId,
  selectedCategory,
  onChange,
  includeAllOption = true,
}: CategorySelectProps) {
  const { data: categories, isLoading, error } = useCategories(groupId);

  if (isLoading) return <div>Carregando categorias...</div>;
  if (error) return <div>Erro ao carregar categorias.</div>;

  return (
    <Select value={selectedCategory} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Filtrar por categoria" />
      </SelectTrigger>
      <SelectContent>
        {includeAllOption && (
          <SelectItem value="all">Todas as categorias</SelectItem>
        )}
        {categories?.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.description}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
