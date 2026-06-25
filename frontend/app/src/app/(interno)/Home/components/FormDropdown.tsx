"use client";

import { useState } from "react";
import {
  BarChart3,
  Copy,
  ExternalLink,
  MoreVertical,
  PenLine,
  Trash2,
} from "lucide-react";
import { publishForm } from "../services/Forms.service";
import ModalPublished from "./modalPublished";
import Link from "next/link";

interface FormDropdownProps {
  formId: string
  isPublished: boolean
  shareUrl: string | null
  onDelete: () => void
  onPublishedChange: (
    formId: string,
    isPublished: boolean,
    shareUrl: string | null
  ) => void
  onDuplicate: (formId: string) => Promise<void>
}

export default function FormDropdown({
  formId,
  isPublished,
  shareUrl,
  onDelete,
  onPublishedChange,
  onDuplicate,
}: FormDropdownProps) {
  const [open, setOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [currentShareUrl, setCurrentShareUrl] = useState(shareUrl)
  const [currentIsPublished, setCurrentIsPublished] = useState(isPublished)
  const [message, setMessage] = useState("")
  const [duplicating, setDuplicating] = useState(false)

  const handlePublishToggle = async () => {
    try {
      setPublishing(true)
      setMessage("")

      const nextStatus = !currentIsPublished

      const response = await publishForm(formId, {
        isPublished: nextStatus,
      })

      setCurrentIsPublished(nextStatus)
      setCurrentShareUrl(response.shareUrl)
      setMessage(response.message)

      onPublishedChange(formId, nextStatus, response.shareUrl)
    } catch (error) {
      console.error(error)
      setMessage("Erro ao atualizar compartilhamento.")
    } finally {
      setPublishing(false)
    }
  }

  const handleCopyLink = async () => {
    if (!currentShareUrl) return

    await navigator.clipboard.writeText(currentShareUrl)
    setMessage("Link copiado!")
  }

  const handleDuplicate = async () => {
    try {
      setDuplicating(true)
      setMessage("")
      await onDuplicate(formId)
      setOpen(false)
    } catch (error) {
      console.error(error)
      setMessage("Erro ao duplicar formulário.")
    } finally {
      setDuplicating(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-8 w-8 flex items-center justify-center rounded-lg text-violet-300 hover:text-white hover:bg-white/10 transition"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-slate-800 shadow-xl overflow-hidden z-50">

          <button type="button" className="w-full flex items-center px-4 py-3 text-violet-100 hover:bg-white/10 transition">
            <Link href={`/Formulario/editar/${formId}`} className="flex items-center w-full">
              <PenLine className="w-4 h-4 mr-2" />
                Editar
            </Link>
          </button>

          <button
            type="button"
            onClick={handleDuplicate}
            disabled={duplicating}
            className="w-full flex items-center px-4 py-3 text-violet-100 hover:bg-white/10 transition disabled:opacity-50"
          >
            <Copy className="w-4 h-4 mr-2" />
            {duplicating ? "Duplicando..." : "Duplicar"}
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              setShowShareModal(true)
            }}
            className="w-full flex items-center px-4 py-3 text-violet-100 hover:bg-white/10 transition"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Compartilhar
          </button>

          <button type="button" className="w-full flex items-center px-4 py-3 text-violet-100 hover:bg-white/10 transition">
          <Link href={`/Respostas/${formId}`} className="flex items-center w-full">
              <BarChart3 className="w-4 h-4 mr-2" />
              Ver respostas
          </Link>
          </button>

          <div className="h-px bg-white/10" />

          <button
            type="button"
            onClick={onDelete}
            className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-white/10 transition"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </button>
        </div>
      )}

      <ModalPublished
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        currentIsPublished={currentIsPublished}
        currentShareUrl={currentShareUrl}
        publishing={publishing}
        message={message}
        onPublishToggle={handlePublishToggle}
        onCopyLink={handleCopyLink}
      />

    </div>
  );
}
