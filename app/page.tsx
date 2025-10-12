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
      {/* Background estático */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Elementos decorativos fixos */}
          <div className="absolute top-[10%] left-[15%] w-4 h-4 opacity-[0.03] bg-primary rounded-full blur-sm" />
          <div className="absolute top-[25%] right-[20%] w-6 h-6 opacity-[0.04] bg-primary rounded-full blur-md" />
          <div className="absolute top-[60%] left-[10%] w-3 h-3 opacity-[0.05] bg-primary rounded-full blur-sm" />
          <div className="absolute top-[80%] right-[15%] w-5 h-5 opacity-[0.03] bg-primary rounded-full blur-md" />
          <div className="absolute top-[40%] left-[70%] w-4 h-4 opacity-[0.04] bg-primary rounded-full blur-sm" />
          <div className="absolute top-[15%] left-[60%] w-2 h-2 opacity-[0.05] bg-primary rounded-full blur-sm" />
          <div className="absolute top-[70%] left-[30%] w-6 h-6 opacity-[0.03] bg-primary rounded-full blur-md" />
          <div className="absolute top-[35%] right-[30%] w-3 h-3 opacity-[0.04] bg-primary rounded-full blur-sm" />
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

            <div className="flex flex-col md:flex-row items-center gap-4">
              <a
                href="https://discord.com/users/bielsolosos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.249.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37.07.07 0 0 0 3.598 4.4c-3.123 4.667-3.975 9.22-3.55 13.714a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.029.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.029.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Contato no Discord</span>
              </a>

              <p className="text-sm text-muted-foreground">
                © 2025 NOTO. Criado com ❤️ por bielsolosos
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
