"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

export function ChangePasswordForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.oldPassword.trim()) {
      toast.error("Senha atual é obrigatória");
      return;
    }

    if (!formData.newPassword.trim()) {
      toast.error("Nova senha é obrigatória");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/users/change-password/${user?.id}`, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      toast.success("Senha alterada com sucesso!");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Alterar Senha"
      description="Altere sua senha atual para uma nova senha segura"
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Senha Atual"
          id="oldPassword"
          type="password"
          value={formData.oldPassword}
          onChange={(e) =>
            setFormData({ ...formData, oldPassword: e.target.value })
          }
          placeholder="Digite sua senha atual"
          required
        />

        <Input
          label="Nova Senha"
          id="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData({ ...formData, newPassword: e.target.value })
          }
          placeholder="Digite a nova senha"
          required
        />

        <Input
          label="Confirmar Nova Senha"
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          placeholder="Confirme a nova senha"
          required
        />

        <Button type="submit" disabled={loading} loading={loading} block>
          Alterar Senha
        </Button>
      </form>
    </Card>
  );
}
