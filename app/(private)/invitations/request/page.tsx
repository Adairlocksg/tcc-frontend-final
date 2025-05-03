"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateInvite } from "@/hooks/use-create-invite";
import { InviteDto } from "@/lib/invitations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { Bell, ChevronLeft, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const requestInviteSchema = z.object({
  link: z.string().min(1, "O campo link é obrigatório"),
});

type RequestInviteForm = z.infer<typeof requestInviteSchema>;
export default function RequestInvitePage() {
  const router = useRouter();
  const { mutate: createInvite, isPending } = useCreateInvite();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestInviteForm>({
    resolver: zodResolver(requestInviteSchema),
  });

  function onSubmit(data: RequestInviteForm) {
    const dto: InviteDto = {
      groupId: data.link.substring(data.link.lastIndexOf("/") + 1),
    };

    createInvite(dto);
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

      <h1 className="mb-6 text-2xl font-bold">
        Solicite a participação em um grupo
      </h1>

      <Card className="mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="pb-3">
            <div className="h-1 w-12 rounded-full bg-primary"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link">Link de convite</Label>
              <Input
                id="link"
                placeholder="Insira o link de convite aqui"
                {...register("link")}
              />
              {errors.link && (
                <p className="text-sm text-red-500">{errors.link.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isPending} className="w-full">
              Solicitar convite
              {isPending ? <Loader2 className="animate-spin" /> : <UserPlus />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
