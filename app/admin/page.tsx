"use client";

import { UserManagement } from "@/components/admin/UserManagement";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.role_admin) {
      router.push("/editor");
    }
  }, [user, router]);

  if (!user?.role_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Painel Administrativo
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie usuários e configurações do sistema
              </p>
            </div>
            <Link href="/editor">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Editor
              </Button>
            </Link>
          </div>

          {/* User Management Section */}
          <UserManagement />
        </div>
      </div>
    </div>
  );
}
