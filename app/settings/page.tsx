"use client";

import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { EditCredentialsForm } from "@/components/settings/EditCredentialsForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
          <div className="flex flex-col lg:flex-row gap-6">
            {/* User Info */}
            <div className="bg-card rounded-lg border border-border p-6 flex-1">
              <h2 className="text-xl font-semibold mb-6">
                Informações da Conta
              </h2>

              {/* Profile Picture Placeholder */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* User Badges */}
              <div className="space-y-4">
                <EditCredentialsForm />

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Tipo de conta
                  </label>
                  <div className="inline-flex">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.roles.includes("ROLE_ADMIN")
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.roles.includes("ROLE_ADMIN") ? "Administrador" : "Usuário"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="flex-1">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
