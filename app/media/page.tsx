"use client";

import { useAuth } from "@/contexts/AuthContext";
import { deleteMedia, getMedia, uploadMedia } from "@/lib/media";
import type { MediaResponse } from "@/types/media";
import type { PageResponse } from "@/types/pagination";
import { ArrowLeft, Copy, Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MediaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mediaPage, setMediaPage] = useState<PageResponse<MediaResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const fetchMedia = async (page = 0, filter = search) => {
    try {
      setLoading(true);
      const data = await getMedia(page, 20, filter);
      setMediaPage(data);
    } catch (error) {
      toast.error("Erro ao carregar a galeria de imagens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMedia(currentPage, search);
    }
  }, [user, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchMedia(0, search);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadMedia(file);
      toast.success("Imagem enviada com sucesso!");
      fetchMedia(0, search);
      setCurrentPage(0);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao enviar a imagem.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar esta imagem?")) return;

    try {
      await deleteMedia(id);
      toast.success("Imagem apagada com sucesso!");
      fetchMedia(currentPage, search);
    } catch (error) {
      toast.error("Erro ao apagar a imagem.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Galeria</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie suas imagens e arquivos de mídia
              </p>
            </div>
            <Link href="/editor">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Editor
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex flex-1 gap-2 max-w-sm">
                <Input
                  type="text"
                  placeholder="Buscar imagens..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button type="submit" variant="secondary">Buscar</Button>
              </form>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button onClick={handleUploadClick} disabled={isUploading}>
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {isUploading ? "Enviando..." : "Nova Imagem"}
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : mediaPage?.content.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">Nenhuma imagem encontrada</h3>
                <p className="text-muted-foreground mt-1">
                  Faça o upload de uma imagem para começar a usar a galeria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaPage?.content.map((media) => (
                  <div
                    key={media.id}
                    className="group relative bg-muted rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    <div className="aspect-square relative flex items-center justify-center bg-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={media.url}
                        alt={media.fileName}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate mb-2" title={media.fileName}>
                        {media.fileName}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => copyToClipboard(media.markdown || `![](${media.url})`)}
                          title="Copiar Markdown"
                        >
                          <Copy className="h-4 w-4 mr-1.5" />
                          Copiar M\u2193
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          size="icon"
                          className="shrink-0"
                          onClick={() => handleDelete(media.id)}
                          title="Apagar imagem"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {mediaPage && mediaPage.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  disabled={mediaPage.first}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {mediaPage.number + 1} de {mediaPage.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={mediaPage.last}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Próxima
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
