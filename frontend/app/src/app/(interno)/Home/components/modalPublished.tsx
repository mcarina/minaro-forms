interface ModalPublishedProps {
    open: boolean
    onClose: () => void
    currentIsPublished: boolean
    currentShareUrl: string | null
    publishing: boolean
    message: string
    onPublishToggle: () => void
    onCopyLink: () => void
}

export default function ModalPublished({
    open,
    onClose,
    currentIsPublished,
    currentShareUrl,
    publishing,
    message,
    onPublishToggle,
    onCopyLink,
}: ModalPublishedProps) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 p-6 text-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">Compartilhar formulário</h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white"
                    >
                        X
                    </button>
                </div>

                <div className="mt-2">
                    <div
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border
                        ${currentIsPublished
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                            }`}
                    >
                        <span
                            className={`mr-2 h-2 w-2 rounded-full
                            ${currentIsPublished
                                    ? "bg-emerald-400"
                                    : "bg-amber-400"
                                }`}
                        />

                        {currentIsPublished ? "Publicado" : "Privado"}
                    </div>
                </div>


                <div className="mt-5 space-y-2">
                    <div className="flex gap-2">
                        <input
                            readOnly
                            value={currentShareUrl ?? ""}
                            placeholder="Publique para gerar o link"
                            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                        />

                        <button
                            type="button"
                            onClick={onCopyLink}
                            disabled={!currentShareUrl}
                            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-50"
                        >
                            Copiar
                        </button>
                    </div>
                </div>

                {message && (
                    <p className="mt-4 text-sm text-violet-300">
                        {message}
                    </p>
                )}

                <button
                    type="button"
                    onClick={onPublishToggle}
                    disabled={publishing}
                    className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                >
                    {publishing
                        ? "Atualizando..."
                        : currentIsPublished
                            ? "Tornar privado"
                            : "Publicar formulário"}
                </button>

            </div>
        </div>
    )
}