"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/use-register";
import { UserDto } from "@/lib/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Loader2, User, User2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "Primeiro nome obrigatório")
    .max(200, "Tamanho máximo de 200 caracteres"),
  lastName: z
    .string()
    .min(1, "Úlitmo nome obrigatório")
    .max(200, "Tamanho máximo de 200 caracteres"),
  email: z.string().email("O campo email deve estar formatado corretamente"),
  userName: z
    .string()
    .min(1, "Usuário obrigatório")
    .max(100, "Tamanho máximo de 100 caracteres"),
  password: z
    .string()
    .min(6, "Usuário obrigatório")
    .max(100, "Tamanho máximo de 100 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { mutate, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  function onSubmit(data: RegisterForm) {
    const dto: UserDto = { ...data };
    mutate(dto);
  }
  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="text-center text-2xl font-bold">
        Cadastro
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Primeiro nome</Label>
            <Input
              id="firstName"
              placeholder="Digite seu primeiro nome"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Último nome</Label>
            <Input
              id="lastName"
              placeholder="Digite seu último nome"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="userName">Usuário</Label>
            <Input
              id="userName"
              placeholder="Digite seu nome de usuário"
              {...register("userName")}
            />
            {errors.userName && (
              <p className="text-sm text-red-500">{errors.userName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Cadastrar
            {isPending ? <Loader2 className="animate-spin" /> : <User />}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/login" className="text-sm underline hover:text-primary">
          Já tem conta? Faça login.
        </Link>
      </CardFooter>
    </Card>
  );
}
