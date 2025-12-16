"use client";

import { useState } from "react";

export default function TestPage() {
  const [theme, setTheme] = useState<"bielLight" | "bielDark">("bielLight");

  const toggleTheme = () => {
    const newTheme = theme === "bielLight" ? "bielDark" : "bielLight";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="min-h-screen bg-base-100 p-8" data-theme={theme}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Teste DaisyUI - Tema: {theme}
          </h1>
          <button onClick={toggleTheme} className="btn btn-primary">
            Trocar Tema
          </button>
        </div>

        <div className="alert alert-info">
          <span>Tema atual: {theme}</span>
          <span>Primary: #e61558 (rosa vibrante)</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-base-content">
            Botões DaisyUI Nativos
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-accent">Accent</button>
            <button className="btn btn-ghost">Ghost</button>
            <button className="btn btn-error">Error</button>
            <button className="btn btn-success">Success</button>
            <button className="btn btn-warning">Warning</button>
            <button className="btn btn-info">Info</button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-base-content">Badges</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="badge badge-primary">Primary</div>
            <div className="badge badge-accent">Accent</div>
            <div className="badge badge-info">Info</div>
            <div className="badge badge-success">Success</div>
            <div className="badge badge-warning">Warning</div>
            <div className="badge badge-error">Error</div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-base-content">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Card Title</h2>
                <p>Conteúdo do card aqui</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Action</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Outro Card</h2>
                <p>Este é outro exemplo de card com DaisyUI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-base-content">
            Cores do Tema
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary text-primary-content p-4 rounded-lg text-center">
              Primary
            </div>
            <div className="bg-secondary text-secondary-content p-4 rounded-lg text-center">
              Secondary
            </div>
            <div className="bg-accent text-accent-content p-4 rounded-lg text-center">
              Accent
            </div>
            <div className="bg-neutral text-neutral-content p-4 rounded-lg text-center">
              Neutral
            </div>
            <div className="bg-base-100 text-base-content p-4 rounded-lg text-center border">
              Base-100
            </div>
            <div className="bg-info text-info-content p-4 rounded-lg text-center">
              Info
            </div>
            <div className="bg-success text-success-content p-4 rounded-lg text-center">
              Success
            </div>
            <div className="bg-error text-error-content p-4 rounded-lg text-center">
              Error
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
