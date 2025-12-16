"use client";

import { UserForm } from "@/components/admin/UserForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Loading } from "@/components/ui/loading";
import api from "@/lib/api";
import { Shield, ShieldOff, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  username: string;
  role_admin: boolean;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error: any) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/users/${userId}`);
      toast.success("Usuário deletado com sucesso");
      fetchUsers();
    } catch (error: any) {
      toast.error("Erro ao deletar usuário");
    }
  };

  const handleToggleAdmin = async (userId: string, currentRole: boolean) => {
    try {
      await api.put(`/users/${userId}/role`, {
        role_admin: !currentRole,
      });
      toast.success(
        `Usuário ${!currentRole ? "promovido a" : "removido de"} administrador`
      );
      fetchUsers();
    } catch (error: any) {
      toast.error("Erro ao alterar permissões do usuário");
    }
  };

  const handleUserCreated = () => {
    setShowCreateForm(false);
    fetchUsers();
    toast.success("Usuário criado com sucesso");
  };

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  if (loading) {
    return (
      <Card className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-2 text-sm">Carregando usuários...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        title="Gerenciamento de Usuários"
        actions={
          <Button onClick={() => setShowCreateForm(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Nome de Usuário</th>
                <th>Email</th>
                <th>Permissões</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium">{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge variant={user.role_admin ? "primary" : "secondary"}>
                      {user.role_admin ? "Administrador" : "Usuário"}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleToggleAdmin(user.id, user.role_admin)
                        }
                      >
                        {user.role_admin ? (
                          <ShieldOff className="h-3 w-3" />
                        ) : (
                          <Shield className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="error"
                        size="sm"
                        onClick={() => setUserToDelete(user)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-8">
              <p>Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </Card>

      {/* Create User Dialog */}
      <Dialog
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Criar Novo Usuário"
      >
        <UserForm onSuccess={handleUserCreated} />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Confirmar Exclusão"
        actions={
          <>
            <Button variant="ghost" onClick={() => setUserToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="error"
              onClick={() => {
                if (userToDelete) {
                  handleDeleteUser(userToDelete.id);
                  setUserToDelete(null);
                }
              }}
            >
              Deletar
            </Button>
          </>
        }
      >
        Tem certeza que deseja deletar o usuário{" "}
        <strong>{userToDelete?.username}</strong>? Esta ação não pode ser
        desfeita.
      </Dialog>
    </>
  );
}
