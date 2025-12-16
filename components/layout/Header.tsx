"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/contexts/NotesContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useMobile } from "@/hooks/useMobile";
import {
  BookOpen,
  Edit3,
  LogOut,
  Menu,
  Moon,
  Save,
  Settings,
  Shield,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileSidebar } from "./MobileSidebar";

export function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { logout, user } = useAuth();
  const {
    selectedPage,
    isEditing,
    hasUnsavedChanges,
    savePage,
    cancelEdit,
    startEditing,
  } = useNotes();
  const isMobile = useMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="navbar fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            {isMobile && (
              <label
                htmlFor="mobile-drawer"
                className="btn btn-ghost btn-circle drawer-button md:hidden"
              >
                <Menu className="h-5 w-5" />
              </label>
            )}

            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Noto</h1>
          </div>
        </div>

        <div className="flex-none">
          <div className="flex items-center gap-2 md:gap-3">
            {hasUnsavedChanges && (
              <Badge variant="warning" size="sm">
                {isMobile ? "•" : "Não salvo"}
              </Badge>
            )}

            {isEditing ? (
              <div className="flex items-center gap-1 md:gap-2">
                <Button
                  onClick={savePage}
                  disabled={!hasUnsavedChanges}
                  size="sm"
                  variant="primary"
                >
                  <Save className="h-3 w-3 md:mr-2" />
                  <span className="hidden md:inline">Salvar</span>
                </Button>
                <Button variant="ghost" onClick={cancelEdit} size="sm">
                  <X className="h-3 w-3 md:mr-2" />
                  <span className="hidden md:inline">Cancelar</span>
                </Button>
              </div>
            ) : (
              selectedPage && (
                <Button onClick={startEditing} size="sm" variant="primary">
                  <Edit3 className="h-3 w-3 md:mr-2" />
                  <span className="hidden md:inline">Editar</span>
                </Button>
              )
            )}

            {/* User Dropdown */}
            <DropdownMenu
              trigger={
                <Avatar
                  placeholder={user?.username?.charAt(0).toUpperCase() || "U"}
                  size="md"
                  shape="circle"
                />
              }
              align="end"
            >
              <li className="menu-title">
                <span>{user?.username}</span>
                <span className="text-xs opacity-60">{user?.email}</span>
              </li>
              <DropdownItem onClick={toggleDarkMode}>
                {darkMode ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Modo Escuro</span>
                  </>
                )}
              </DropdownItem>
              {user?.role_admin && (
                <DropdownItem>
                  <Link href="/admin" className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Administração</span>
                  </Link>
                </DropdownItem>
              )}
              <DropdownItem>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownItem>
              <li className="divider"></li>
              <DropdownItem onClick={logout}>
                <span className="text-error flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </span>
              </DropdownItem>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobile && (
        <div className="drawer">
          <input
            id="mobile-drawer"
            type="checkbox"
            className="drawer-toggle"
            checked={drawerOpen}
            onChange={(e) => setDrawerOpen(e.target.checked)}
          />
          <div className="drawer-side z-50">
            <label htmlFor="mobile-drawer" className="drawer-overlay"></label>
            <div className="w-80 min-h-full bg-base-100">
              <MobileSidebar onClose={() => setDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
