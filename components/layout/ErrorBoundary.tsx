"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-6 p-8">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Algo deu errado</h1>
              <p className="text-muted-foreground max-w-md">Ocorreu um erro inesperado. Tente recarregar a página.</p>
            </div>
            <Button onClick={() => window.location.reload()}>Recarregar página</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
