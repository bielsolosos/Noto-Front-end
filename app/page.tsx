"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { parseMarkdown } from "@/lib/markdownParser";
import {
  ArrowRight,
  Edit3,
  Lock,
  Moon,
  Paintbrush,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [demoContent, setDemoContent] = useState(
    '# Bem-vindo ao NOTO\n\n**Organize** suas *ideias* de forma `simples` e eficiente.\n\n- [x] Editor intuitivo\n- [x] Markdown em tempo real\n- [ ] Suas próximas grandes ideias\n\n> "A simplicidade é a sofisticação suprema" - Leonardo da Vinci'
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const features = [
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: "Editor Markdown Inteligente",
      description:
        "Formatação automática conforme você digita. Listas, títulos, links - tudo funciona naturalmente.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Atalhos Poderosos",
      description:
        "Ctrl+B para negrito, Ctrl+I para itálico, Enter para continuar listas. Produtividade máxima.",
    },
    {
      icon: <Paintbrush className="w-6 h-6" />,
      title: "Design que não Distrai",
      description:
        "Interface limpa e minimalista. Foque no que importa: seu conteúdo.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Privado por Design",
      description:
        "Suas anotações ficam seguras. Cada página é privada e pertence apenas a você.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background animado */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="animate-float"
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 0.5}rem`,
                height: `${Math.random() * 2 + 0.5}rem`,
                opacity: 0.05,
                background: `hsl(var(--primary))`,
                borderRadius: "50%",
                filter: "blur(6px)",
                animation: `float ${Math.random() * 15 + 20}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">
                N
              </span>
            </div>
            <span className="text-xl font-bold">NOTO</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200"
              aria-label="Alternar tema"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>

            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Editor de anotações moderno e intuitivo</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Suas ideias merecem
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              um lar melhor
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Editor de anotações minimalista e poderoso. Organize suas ideias com
            Markdown, atalhos inteligentes e uma interface que não distrai.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <span>Começar agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <button
              onClick={() =>
                document
                  .getElementById("demo")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 text-primary hover:bg-primary/10 px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-200"
            >
              Ver demonstração
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Feito para produtividade
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cada funcionalidade foi pensada para tornar suas anotações mais
              fluidas e organizadas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Veja o editor em ação
            </h2>
            <p className="text-xl text-muted-foreground">
              Digite e veja a formatação acontecer em tempo real
            </p>
          </div>

          <div className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-muted/50 px-6 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground ml-4">
                  Editor NOTO
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 h-96">
              {/* Editor lado esquerdo */}
              <div className="relative">
                <textarea
                  value={demoContent}
                  onChange={(e) => setDemoContent(e.target.value)}
                  className="w-full h-full p-6 bg-transparent resize-none focus:outline-none border-0 font-mono text-sm"
                  placeholder="Digite aqui seu Markdown..."
                />
              </div>

              {/* Preview lado direito */}
              <div className="border-l border-border">
                <div className="w-full h-full p-6 overflow-y-auto">
                  <div
                    className="prose prose-sm prose-neutral dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: demoContent
                        ? parseMarkdown(demoContent)
                        : "<p class='text-muted-foreground italic'>Preview aparecerá aqui...</p>",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/**
       * {/*\ CTA Final *\/}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para organizar suas ideias?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Junte-se a centenas de pessoas que já escolheram o NOTO para suas
            anotações.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <span>Começar gratuitamente</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Gratuito para sempre</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Sem limites de páginas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>100% privado</span>
            </div>
          </div>
        </div>
      </section> 
      **/}

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  N
                </span>
              </div>
              <span className="font-semibold">NOTO</span>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2025 NOTO. Criado com ❤️ por bielsolosos
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
          }
          100% {
            transform: translateY(0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
