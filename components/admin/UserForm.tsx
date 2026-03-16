"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

interface UserFormProps {
  onSuccess: () => void;
}

export function UserForm({ onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Nome de usuário, email, senha e confirmação de senha são obrigatórios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      await api.post("api/users/register", formData);
      onSuccess();
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nome de Usuário</Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          placeholder="Digite o nome de usuário"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Digite o email"
          required
        />
      </div>
            <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Digite a senha"
          required
        />
      </div>
            <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirme a Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="Confirme a senha"
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
}
