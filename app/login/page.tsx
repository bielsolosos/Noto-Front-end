"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginScreen() {
  return <LoginContent />;
}

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      alert("Login falhou");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background estático */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-card/30" />
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Elementos decorativos fixos */}
          <div className="absolute top-[20%] left-[10%] w-8 h-8 opacity-[0.08] bg-primary rounded-full blur-lg" />
          <div className="absolute top-[70%] right-[15%] w-12 h-12 opacity-[0.06] bg-primary rounded-full blur-xl" />
          <div className="absolute top-[40%] left-[80%] w-6 h-6 opacity-[0.10] bg-primary rounded-full blur-md" />
          <div className="absolute top-[85%] left-[25%] w-10 h-10 opacity-[0.07] bg-primary rounded-full blur-lg" />
          <div className="absolute top-[15%] right-[30%] w-4 h-4 opacity-[0.09] bg-primary rounded-full blur-md" />
          <div className="absolute top-[60%] left-[5%] w-14 h-14 opacity-[0.05] bg-primary rounded-full blur-xl" />
        </div>
      </div>

      {/* Login container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div
          className="w-full max-w-md rounded-2xl p-8"
          style={{
            backgroundColor: "hsl(var(--card) / 0.8)",
            color: "hsl(var(--card-foreground))",
            borderRadius: "var(--radius)",
            backdropFilter: "blur(12px)",
            boxShadow: `
              0 0 0 1px hsl(var(--border) / 0.1),
              0 20px 25px -5px rgb(0 0 0 / 0.1),
              0 10px 10px -5px rgb(0 0 0 / 0.04)
            `,
          }}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                N
              </span>
            </div>
            <h2 className="text-3xl font-bold">NOTO</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Faça login para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  className="block mb-2 text-sm font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    style={{
                      borderColor: "hsl(var(--border))",
                      backgroundColor: "hsl(var(--background))",
                      color: "hsl(var(--foreground))",
                    }}
                    autoComplete="email"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium"
                  htmlFor="password"
                >
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary/20 pr-12"
                    style={{
                      borderColor: "hsl(var(--border))",
                      backgroundColor: "hsl(var(--background))",
                      color: "hsl(var(--foreground))",
                    }}
                    autoComplete="current-password"
                    placeholder="Senha"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary/10 focus:outline-none transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-primary" />
                    ) : (
                      <Eye className="w-5 h-5 text-primary" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-medium relative overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              <span className="relative z-10">Entrar</span>
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
                style={{
                  background:
                    "linear-gradient(45deg, transparent, hsl(var(--primary) / 0.3), transparent)",
                  transform: "translateX(-100%)",
                  animation: "shine 1.5s infinite",
                }}
              />
            </button>
          </form>

          {/* Seção de ajuda */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Precisa criar uma conta ou tem dúvidas?
              </p>
              <a
                href="https://discord.com/users/bielsolosos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.249.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37.07.07 0 0 0 3.598 4.4c-3.123 4.667-3.975 9.22-3.55 13.714a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.029.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.029.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Contate bielsolosos no Discord</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de alternância de tema no canto inferior direito */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-card shadow-lg border border-border transition-colors duration-200 hover:bg-primary/10"
        aria-label="Alternar tema"
        type="button"
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-primary" />
        ) : (
          <Moon className="w-6 h-6 text-primary" />
        )}
      </button>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
