"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Plus, Pencil, Loader2, Save } from "lucide-react";
import { getGroups, Group, GroupDto, setFavoriteGroup } from "@/lib/groups";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useGroups } from "@/hooks/use-groups";
import { useUpdateGroup } from "@/hooks/use-update-group";

export default function GroupsPage() {
  const { data: groups, isLoading, error } = useGroups();
  const { mutate: updateGroup, isPending } = useUpdateGroup();
  const router = useRouter();
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleFavorite = async (groupId: string) => {
    try {
      toast.success("Favorite group updated");
    } catch (error) {
      console.error("Failed to set favorite group:", error);
      toast.error("Failed to update favorite group");
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setName(group.name);
    setDescription(group.description || "");
  };

  const handleSaveEdit = () => {
    if (!editingGroup) return;
    const dto: GroupDto = {
      name,
      description,
    };
    updateGroup(
      { id: editingGroup.id, dto },
      {
        onSuccess: () => {
          setEditingGroup(null);
          setName("");
          setDescription("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container pb-20">
      <div className="py-6">
        <h1 className="text-2xl font-bold">Meus grupos</h1>
        <p className="text-muted-foreground">Gerencie seus grupos de despesa</p>
      </div>

      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => router.push("/groups/new")}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Novo
        </Button>
      </div>

      {groups?.length === 0 ? (
        <Card className="text-center p-8">
          <p className="mb-4 text-muted-foreground">
            You haven't created any groups yet.
          </p>
          <Button onClick={() => router.push("/groups/new")}>
            Crie seu primeiro grupo
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {groups?.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{group.name}</h3>
                      <button onClick={() => handleFavorite(group.id)}>
                        <Star
                          className={`h-5 w-5 ${
                            group.favorite
                              ? "fill-amber-500 text-amber-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {group.description || "Sem descrição"}
                    </p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {group.members}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-muted/20 p-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(group)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push(`/groups/${group.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!editingGroup}
        onOpenChange={(open) => !open && setEditingGroup(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar grupo</DialogTitle>
            <DialogDescription>
              Faça alterações nas informações do grupo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do grupo</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex. Casa, Viagem, Amigos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descição</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o propósito desse grupo"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingGroup(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Salvar
              {isPending ? <Loader2 className="animate-spin" /> : <Save />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
