"use client";

import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { EditCredentialsForm } from "@/components/settings/EditCredentialsForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/AuthContext";
import { cropImageToFile, getImageDimensions } from "@/lib/imageCrop";
import { uploadProfileImage } from "@/lib/media";
import {
  PROFILE_IMAGE_RULES,
  formatMaxFileSizeMb,
  isAcceptedProfileImageMimeType,
} from "@/lib/profileImageRules";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, refreshUser, isLoading } = useAuth();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageToCropUrl, setImageToCropUrl] = useState<string | null>(null);
  const [imageToCropFileName, setImageToCropFileName] = useState("avatar.jpg");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const clearCropImage = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImageToCropUrl(null);
  }, []);

  const resetCropDialogState = useCallback(() => {
    setIsCropDialogOpen(false);
    setImageToCropFileName("avatar.jpg");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    clearCropImage();
  }, [clearCropImage]);

  const handleCropComplete = useCallback(
    (_area: Area, areaPixels: Area) => {
      setCroppedAreaPixels(areaPixels);
    },
    []
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  if (isLoading || !user) {
    return null;
  }

  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    if (!isAcceptedProfileImageMimeType(selectedFile.type)) {
      toast.error("Use uma imagem JPG, PNG ou WEBP.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > PROFILE_IMAGE_RULES.maxFileSizeBytes) {
      toast.error(
        `A imagem deve ter no máximo ${formatMaxFileSizeMb(
          PROFILE_IMAGE_RULES.maxFileSizeBytes
        )}.`
      );
      event.target.value = "";
      return;
    }

    try {
      const dimensions = await getImageDimensions(selectedFile);

      if (
        dimensions.width < PROFILE_IMAGE_RULES.minWidth ||
        dimensions.height < PROFILE_IMAGE_RULES.minHeight
      ) {
        toast.error(
          `A imagem precisa ter pelo menos ${PROFILE_IMAGE_RULES.minWidth}x${PROFILE_IMAGE_RULES.minHeight}px.`
        );
        event.target.value = "";
        return;
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const objectUrl = URL.createObjectURL(selectedFile);
      objectUrlRef.current = objectUrl;

      setImageToCropUrl(objectUrl);
      setImageToCropFileName(selectedFile.name);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsCropDialogOpen(true);
    } catch (_error: unknown) {
      toast.error(
        ((_error as { response?: { data?: { message?: string } } })?.response?.data?.message) ||
          "Não foi possível processar a imagem selecionada."
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleUploadCroppedImage = async () => {
    if (!imageToCropUrl || !croppedAreaPixels) {
      toast.error("Selecione o recorte da imagem antes de continuar.");
      return;
    }

    try {
      setIsUploadingProfileImage(true);

      const croppedFile = await cropImageToFile({
        imageSrc: imageToCropUrl,
        cropAreaPixels: croppedAreaPixels,
        fileName: imageToCropFileName,
        outputSize: PROFILE_IMAGE_RULES.outputSize,
        mimeType: PROFILE_IMAGE_RULES.outputMimeType,
        quality: PROFILE_IMAGE_RULES.outputQuality,
      });

      await uploadProfileImage(croppedFile);
      await refreshUser();
      toast.success("Foto de perfil atualizada com sucesso.");
      resetCropDialogState();
    } catch (_error: unknown) {
      toast.error(
        ((_error as { response?: { data?: { message?: string } } })?.response?.data?.message) || "Erro ao atualizar foto de perfil"
      );
    } finally {
      setIsUploadingProfileImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Configurações
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie suas configurações de conta
              </p>
            </div>
            <Link href="/editor">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Editor
              </Button>
            </Link>
          </div>

          {/* Settings Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* User Info */}
            <div className="bg-card rounded-lg border border-border p-6 flex-1">
              <h2 className="text-xl font-semibold mb-6">
                Informações da Conta
              </h2>

              <div className="flex flex-col items-center mb-6 gap-3">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarImage
                    src={user.profileImageUrl || undefined}
                    alt={`Avatar de ${user.username}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                  disabled={isUploadingProfileImage}
                />

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  disabled={isUploadingProfileImage}
                  onClick={() => inputRef.current?.click()}
                >
                  {isUploadingProfileImage ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="mr-2 h-4 w-4" />
                  )}
                  {isUploadingProfileImage ? "Enviando..." : "Alterar foto"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Recorte quadrado e exportação em {PROFILE_IMAGE_RULES.outputSize}
                  x{PROFILE_IMAGE_RULES.outputSize}px.
                </p>
              </div>

              {/* User Badges */}
              <div className="space-y-4">
                <EditCredentialsForm />

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Tipo de conta
                  </label>
                  <div className="inline-flex">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.roles.includes("ROLE_ADMIN")
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.roles.includes("ROLE_ADMIN") ? "Administrador" : "Usuário"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="flex-1">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isCropDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isUploadingProfileImage) {
            resetCropDialogState();
            return;
          }

          setIsCropDialogOpen(open);
        }}
      >
        <DialogContent
          className="max-w-xl"
          onEscapeKeyDown={(event) => {
            if (isUploadingProfileImage) {
              event.preventDefault();
            }
          }}
          onInteractOutside={(event) => {
            if (isUploadingProfileImage) {
              event.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Recortar foto de perfil</DialogTitle>
            <DialogDescription>
              Ajuste o enquadramento da imagem antes do envio.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative h-72 w-full overflow-hidden rounded-lg bg-black">
              {imageToCropUrl && (
                <Cropper
                  image={imageToCropUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={handleCropComplete}
                  onZoomChange={setZoom}
                />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Zoom</p>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0] ?? 1)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={resetCropDialogState}
              disabled={isUploadingProfileImage}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleUploadCroppedImage}
              disabled={isUploadingProfileImage || !imageToCropUrl}
            >
              {isUploadingProfileImage ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isUploadingProfileImage ? "Enviando..." : "Salvar foto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
