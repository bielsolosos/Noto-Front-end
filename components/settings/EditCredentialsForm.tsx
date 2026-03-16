"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editCredentialsSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  email: z.string().email("Deve ser um email válido").min(1, "Email é obrigatório"),
});

type EditCredentialsFormData = z.infer<typeof editCredentialsSchema>;

export function EditCredentialsForm() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCredentialsFormData>({
    resolver: zodResolver(editCredentialsSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: EditCredentialsFormData) => {
    try {
      setLoading(true);
      await api.post(`api/users/edit-credentials`, data);
      
      toast.success("Credenciais atualizadas com sucesso! Por favor, faça login novamente.");
      logout();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar credenciais");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (!isEditing) {
    return (
      <div className="space-y-4 relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 text-muted-foreground hover:text-foreground z-10"
          onClick={() => {
            reset({ username: user.username, email: user.email });
            setIsEditing(true);
          }}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Nome de usuário
          </label>
          <div className="px-3 py-2 bg-muted rounded-md min-h-[40px] flex items-center">
            <span className="text-sm font-medium">{user.username}</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Email
          </label>
          <div className="px-3 py-2 bg-muted rounded-md min-h-[40px] flex items-center">
            <span className="text-sm font-medium">{user.email}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative">
     <Button 
        variant="ghost" 
        size="icon" 
        type="button"
        className="absolute right-0 top-0 text-muted-foreground hover:text-foreground z-10"
        onClick={() => setIsEditing(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="space-y-2 pt-2">
        <Label htmlFor="username">Nome de usuário</Label>
        <Input
          id="username"
          {...register("username")}
          placeholder="Seu nome de usuário"
        />
        {errors.username && (
          <p className="text-sm text-destructive">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="Seu email"
        />
        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
