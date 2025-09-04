"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

interface UserFormProps {
  onSuccess: () => void;
}

export function UserForm({ onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    apiKey: "",
    role_admin: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.apiKey.trim()
    ) {
      toast.error("Nome de usuário, email e API key são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      await api.post("/users", formData);
      onSuccess();
      setFormData({ username: "", email: "", apiKey: "", role_admin: false });
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
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={formData.apiKey}
          onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
          placeholder="Digite a API key para criação"
          required
        />
        <p className="text-xs text-muted-foreground">
          API key necessária para criar novos usuários
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="admin-role"
          checked={formData.role_admin}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, role_admin: checked })
          }
        />
        <Label htmlFor="admin-role">Administrador</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
}
