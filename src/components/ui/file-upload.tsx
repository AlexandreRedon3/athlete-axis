"use client"
import React from 'react';

import { Button } from "./button"
import { Crop, Trash, Upload } from "lucide-react"
import Image from "next/image"
import { InputHTMLAttributes, useCallback, useEffect, useState } from "react"
import { Accept, useDropzone } from "react-dropzone"
import { toast } from "react-toastify"

import { bytesToMegabytes } from "@/lib/utils"
import { cn } from "@/lib/utils"

import ImageCrop from "./image-crop"

function File({
  file,
  i,
  removeFile,
  handleCrop,
}: {
  file: File
  i: number
  removeFile: (index: number) => void
  handleCrop: (index: number, file: File) => void
}) {
  const [isCroppingOpen, setIsCroppingOpen] = useState(false)

  const setFile = useCallback(
    (file: File) => {
      handleCrop(i, file)
    },
    [handleCrop, i]
  )

  return (
    <li className="flex flex-col gap-2" key={i}>
      <div className="border-muted-foreground/30 flex flex-row items-center justify-between gap-1 rounded-medium border p-1 pl-3">
        <p className="flex flex-row overflow-hidden">
          <span className="block truncate">{file.name}</span>
          <span className="text-muted-foreground ml-1 block">({bytesToMegabytes(file.size, true)}Mo)</span>
        </p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setIsCroppingOpen(true)}>
            <Crop className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={() => removeFile(i)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ImageCrop originalFile={file} setFile={setFile} onOpenChange={() => setIsCroppingOpen(false)} isOpen={isCroppingOpen} />
    </li>
  )
}

export type TFileUploadProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "onFilesChange" | "dictionary" | "disabled" | "accept" | "dictionary"
> & {
  className?: string
  onFilesChange?: (files: File[]) => void
  disabled?: boolean
  accept?: Accept //? See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  maxFiles?: number
  acceptCamera?: boolean
  enablePreview?: boolean
}

export default function FileUpload({
  className,
  onFilesChange,
  disabled,
  accept,
  maxFiles,
  acceptCamera,
  enablePreview,
  ...props
}: TFileUploadProps) {
  const { acceptedFiles, getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept,
    maxFiles,
    multiple: maxFiles !== 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDropRejected(fileRejections: any) {
      const fileRejection = fileRejections[0]
      if (fileRejection.errors[0].code === "file-invalid-type") {
        toast.error("Le fichier n'est pas valide")
      }
    },
  })
  const [files, setFiles] = useState<File[]>([])
  const [croppedFiles, setCroppedFiles] = useState<File[]>([])
  useEffect(() => {
    if (!acceptedFiles.length) return
    onFilesChange?.(acceptedFiles as File[])
    setFiles(acceptedFiles as File[])
    setCroppedFiles(acceptedFiles as File[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedFiles])

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    onFilesChange?.(newFiles)
    setFiles(newFiles)
    setCroppedFiles(newFiles)
  }

  const handleCrop = useCallback(
    async (index: number, file: File) => {
      const newFiles = [...files]
      newFiles.splice(index, 1, file)
      onFilesChange?.(newFiles)
      setCroppedFiles(newFiles)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  )

  const renderPreview = () => {
    if (!enablePreview || croppedFiles.length === 0) return null

    const file = croppedFiles[0]
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative h-[250px] w-full">
          <Image
            src={URL.createObjectURL(file)}
            alt={file.name}
            width={250}
            height={250}
            className="m-auto object-contain"
          />
        </div>
      )
    } else {
      return (
        <div className="flex h-[250px] items-center justify-center">
          <p>{file.name}</p>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {enablePreview && croppedFiles.length > 0 ? (
        renderPreview()
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "bg-muted/20 flex h-[250px] cursor-pointer flex-col items-center justify-center gap-4 rounded-medium border border-dashed border-transparent p-2 px-6 text-foreground transition-all",
            {
              "hover:bg-muted/40 focus:bg-muted/40 hover:border-primary focus:border-primary": !disabled,
              "bg-muted/50 border-primary": isDragAccept,
              "border-danger bg-danger/40": isDragReject,
            },
            className
          )}
        >
          <input
            type="file"
            {...getInputProps()}
            disabled={disabled}
            accept={getInputProps().accept + (acceptCamera ? ";capture=camera" : "")}
            {...props}
          />
          <Upload className="size-12" />
          <p className="text-center text-sm text-foreground/80">
            Cliquez ou faites glisser un fichier ici pour l&apos;uploader.
          </p>
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {croppedFiles.map((file, i) => (
          <File file={file} i={i} removeFile={removeFile} handleCrop={handleCrop} key={i} />
        ))}
      </ul>
    </div>
  )
}
