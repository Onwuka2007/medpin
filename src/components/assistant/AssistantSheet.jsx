import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  FileSearch,
  PackageSearch,
  ScanText,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import {
  assistantQuickActions,
  assistantUploadFlows,
} from "../../data/mock/index.js";

const iconMap = {
  scanText: ScanText,
  packageSearch: PackageSearch,
  sparkles: Sparkles,
  fileSearch: FileSearch,
};

function AssistantSheet({ open, onClose, initialActionId = null }) {
  const [activeActionId, setActiveActionId] = useState(initialActionId);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const activeUploadFlow = useMemo(
    () => (activeActionId ? assistantUploadFlows[activeActionId] : null),
    [activeActionId]
  );

  useEffect(() => {
    if (open) {
      setActiveActionId(initialActionId ?? null);
      if (!initialActionId) {
        resetUploadState();
      }
    }
  }, [initialActionId, open]);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedPreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setSelectedPreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  }

  function resetUploadState() {
    setSelectedFile(null);
    setSelectedPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleClose() {
    setActiveActionId(null);
    resetUploadState();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close assistant"
        onClick={handleClose}
        className="absolute inset-0 bg-[rgba(12,25,20,0.18)] backdrop-blur-[2px]"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-xl rounded-t-[2rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,#fbfdfb_0%,#f3f8f5_100%)] shadow-[0_-30px_80px_rgba(31,86,73,0.18)]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[rgba(31,86,73,0.16)]" />

        <div className="flex items-center justify-between px-5 pb-3 pt-4 sm:px-6">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary)]">MedPin assistant</p>
            <p className="mt-1 text-sm text-[#648277]">
              {activeUploadFlow
                ? "Upload a photo and continue the flow from here."
                : "Choose a quick action. No typing needed."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-foreground)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {activeUploadFlow ? (
          <div className="px-5 pb-6 sm:px-6">
            <button
              type="button"
              onClick={() => {
                setActiveActionId(null);
                resetUploadState();
              }}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="rounded-[1.7rem] border border-[var(--color-border)] bg-white p-5 shadow-[0_16px_40px_rgba(31,86,73,0.08)]">
              <p className="text-xl font-semibold text-[var(--color-foreground)]">
                {activeUploadFlow.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#628076]">
                {activeUploadFlow.description}
              </p>

              <div className="mt-5 rounded-[1.6rem] border border-dashed border-[rgba(31,86,73,0.26)] bg-[var(--color-surface-soft)] p-4 text-center">
                {selectedPreviewUrl ? (
                  <div>
                    <div className="overflow-hidden rounded-[1.2rem] border border-[var(--color-border)] bg-white">
                      <img
                        src={selectedPreviewUrl}
                        alt={selectedFile?.name || "Selected upload preview"}
                        className="h-64 w-full object-cover"
                      />
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-[var(--color-border)] bg-white px-4 py-3 font-medium text-[var(--color-foreground)]"
                      >
                        <Upload className="h-4.5 w-4.5" />
                        Replace image
                      </button>
                      <button
                        type="button"
                        onClick={resetUploadState}
                        className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-[rgba(31,86,73,0.18)] bg-transparent px-4 py-3 font-medium text-[#628076]"
                      >
                        <X className="h-4.5 w-4.5" />
                        Remove image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-[var(--color-foreground)]">
                      Drop image here or choose a source
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#6f8980]">
                      {activeUploadFlow.helperText}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-[var(--color-border)] bg-white px-4 py-3 font-medium text-[var(--color-foreground)]"
                      >
                        <Upload className="h-4.5 w-4.5" />
                        Upload image
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-3 font-medium text-[var(--color-primary-foreground)]"
                      >
                        <Camera className="h-4.5 w-4.5" />
                        Take photo
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 pb-6 sm:px-6">
            <div className="grid gap-3">
              {assistantQuickActions.map((action) => {
                const Icon = iconMap[action.icon];
                const isUploadAction = action.category === "upload";

                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => {
                      if (isUploadAction) {
                        setActiveActionId(action.id);
                        return;
                      }
                    }}
                    className="flex items-start gap-4 rounded-[1.5rem] border border-[var(--color-border)] bg-white px-4 py-4 text-left shadow-[0_10px_28px_rgba(31,86,73,0.06)] transition hover:bg-[var(--color-surface-soft)]"
                  >
                    <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
                      <Icon className="h-5 w-5" strokeWidth={2.1} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-semibold text-[var(--color-foreground)]">
                        {action.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[#6c877e]">
                        {action.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssistantSheet;
