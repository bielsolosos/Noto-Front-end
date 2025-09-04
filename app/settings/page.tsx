"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Configurações
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie suas configurações de conta
              </p>
            </div>
            <Link href="/editor">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Editor
              </Button>
            </Link>
          </div>

          {/* Settings Content */}
          <div className="grid gap-6">
            {/* User Info */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4">Informações da Conta</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Nome de usuário:</span> {user.username}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Tipo de conta:</span>{" "}
                  {user.role_admin ? "Administrador" : "Usuário"}
                </p>
              </div>
            </div>

            {/* Change Password */}
            <div className="flex justify-center">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
