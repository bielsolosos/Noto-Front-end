"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const { darkMode } = useTheme();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      alert("Login falhou");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-lg"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          borderRadius: "var(--radius)",
          boxShadow: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`,
        }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">NOTO</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 rounded-lg border"
              style={{
                borderColor: "hsl(var(--border))",
                backgroundColor: "hsl(var(--input))",
                color: "hsl(var(--foreground))",
              }}
              autoComplete="email"
            />
            {errors.email && (
              <p
                className="mt-1 text-sm"
                style={{ color: "hsl(var(--destructive))" }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-lg border"
              style={{
                borderColor: "hsl(var(--border))",
                backgroundColor: "hsl(var(--input))",
                color: "hsl(var(--foreground))",
              }}
              autoComplete="current-password"
            />
            {errors.password && (
              <p
                className="mt-1 text-sm"
                style={{ color: "hsl(var(--destructive))" }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold"
            style={{
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                "hsl(var(--primary) / 0.8)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "hsl(var(--primary))")
            }
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
