"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PencilIcon, Save, TrashIcon } from "lucide-react";
import { Category, CategoryDto, deleteCategory } from "@/lib/categories";
import { toast } from "sonner";
import { useCategories } from "@/hooks/use-categories";
import { useUpdateCategory } from "@/hooks/use-update-category";

interface CategoryListProps {
  groupId: string;
}

export function CategoryList({ groupId }: CategoryListProps) {
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editDesctiption, setEditDesctiption] = useState("");
  // const [editActive, setEditActive] = useState(true);
  const { data: categories, isLoading, isError } = useCategories(groupId);
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setEditDesctiption(category.description);
    // setEditActive(category.active);
  };

  const handleUpdate = async () => {
    const dto: CategoryDto = {
      description: editDesctiption,
    };

    updateCategory(
      { groupId, id: editCategory?.id!, dto },
      {
        onSuccess: () => {
          setEditCategory(null);
          setEditDesctiption("");
        },
      }
    );
  };

  // const handleDelete = async (categoryId: string, categoryName: string) => {
   
  // };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (categories?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="mb-4 text-muted-foreground">
          Nenhuma categoria criada para esse grupo ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categories?.map((category) => (
        <div key={category.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  category.active ? "bg-emerald-500" : "bg-gray-400"
                }`}
              />
              <span className="font-medium">{category.description}</span>
            </div>

            <div className="flex space-x-1">
              <Dialog
                open={!!editCategory}
                onOpenChange={(open) => !open && setEditCategory(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(category)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alterar categoria</DialogTitle>
                    <DialogDescription>
                      Make changes to the category. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Descrição</Label>
                      <Input
                        id="name"
                        value={editDesctiption}
                        onChange={(e) => setEditDesctiption(e.target.value)}
                      />
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={editActive}
                        onCheckedChange={setEditActive}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div> */}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setEditCategory(null)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdate}>
                      Salvar
                      {isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Save />
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500"
                onClick={() => handleDelete(category.id, category.description)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
