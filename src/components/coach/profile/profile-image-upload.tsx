"use client"

import React from 'react';
import { Camera, Loader2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { useUpdateProfile } from "@/hooks/use-profile-actions";
import { useUploadThing } from "@/lib/uploadthing/react";

interface ProfileImageUploadProps {
  currentImage?: string | null;
  userName?: string | null;
  onImageUpdate?: (imageUrl: string) => void;
}

export const ProfileImageUpload = ({ 
  currentImage, 
  userName, 
  onImageUpdate 
}: ProfileImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { updateProfile } = useUpdateProfile();
  const { startUpload, isUploading: isUploadThingUploading } = useUploadThing("imageUploader");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploaded = await startUpload(acceptedFiles);
      
      if (uploaded && uploaded[0]) {
        const imageUrl = uploaded[0].url;
        
        // Mettre à jour le profil avec la nouvelle image
        await updateProfile({ image: imageUrl });
        
        // Notifier le composant parent
        onImageUpdate?.(imageUrl);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    } finally {
      setIsUploading(false);
    }
  }, [startUpload, updateProfile, onImageUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
  });

  const initials = userName
    ? userName.split(" ").map(n => n[0]).join("")
    : "AA";

  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className={`
          w-24 h-24 rounded-full cursor-pointer transition-all duration-200
          ${isDragActive ? 'ring-4 ring-emerald-300' : 'hover:ring-2 hover:ring-emerald-200'}
          ${isUploading || isUploadThingUploading ? 'opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {currentImage ? (
          <img
            src={currentImage}
            alt={userName || "Photo de profil"}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {initials}
          </div>
        )}
        
        {/* Overlay pour l'upload */}
        {(isUploading || isUploadThingUploading) && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>
      
      {/* Bouton camera */}
      <button
        {...getRootProps()}
        className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
        disabled={isUploading || isUploadThingUploading}
      >
        <Camera className="h-4 w-4" />
      </button>
      
      {/* Indicateur de drag */}
      {isDragActive && (
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <div className="text-emerald-600 font-medium text-sm">
            Déposer ici
          </div>
        </div>
      )}
    </div>
  );
}; 