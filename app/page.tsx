"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { zodResolver } from "@hookform/resolvers/zod";
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
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-card/30" />
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="animate-float"
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}rem`,
                height: `${Math.random() * 3 + 1}rem`,
                opacity: 0.1,
                background: `hsl(var(--primary))`,
                borderRadius: "50%",
                filter: "blur(8px)",
                animation: `float ${Math.random() * 10 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary/10 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-primary"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M15.12 15.12A8.96 8.96 0 0112 17c-4.418 0-8-3.582-8-8 0-1.657.672-3.156 1.76-4.24m2.12 2.12A8.96 8.96 0 0112 7c4.418 0 8 3.582 8 8 0 1.657-.672 3.156-1.76 4.24"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-primary"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.687 1.654-1.217 2.36M15.12 15.12A8.96 8.96 0 0112 17c-4.418 0-8-3.582-8-8 0-1.657.672-3.156 1.76-4.24"
                        />
                      </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-primary"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-primary"
          >
            <path
              fillRule="evenodd"
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
          100% {
            transform: translateY(0) rotate(360deg);
          }
        }
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
