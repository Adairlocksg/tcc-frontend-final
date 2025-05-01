"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoginDto } from "@/lib/users";
import { useLogin } from "@/hooks/use-login";
import { Loader2, LogIn } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Usuário obrigatório"),
  password: z.string(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { mutate: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginForm) {
    const dto: LoginDto = {
      userName: data.username,
      password: data.password,
    };

    login(dto);
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="text-center text-2xl font-bold">Login</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              placeholder="Digite seu usuário"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
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
            Entrar
            {isPending ? <Loader2 className="animate-spin" /> : <LogIn />}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/register" className="text-sm underline hover:text-primary">
          Não é usuário? Cadastre-se.
        </Link>
      </CardFooter>
    </Card>
  );
}
