"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
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
      <Input
        label="Nome de Usuário"
        id="username"
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        placeholder="Digite o nome de usuário"
        required
      />

      <Input
        label="Email"
        id="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Digite o email"
        required
      />

      <Input
        label="API Key"
        id="apiKey"
        type="password"
        value={formData.apiKey}
        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
        placeholder="Digite a API key para criação"
        helperText="API key necessária para criar novos usuários"
        required
      />

      <Toggle
        id="admin-role"
        label="Administrador"
        checked={formData.role_admin}
        onChange={(e) =>
          setFormData({ ...formData, role_admin: e.target.checked })
        }
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading} loading={loading}>
          Criar Usuário
        </Button>
      </div>
    </form>
  );
}
