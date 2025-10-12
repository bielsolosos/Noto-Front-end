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
