import { Bot } from "lucide-react";

export default function AssistantLauncher({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed bottom-5 right-5 z-40 inline-flex h-15 w-15 items-center justify-center rounded-full border border-(--color-primary) bg-(--color-primary) text-(--color-primary-foreground) shadow-[0_22px_48px_rgba(31,86,73,0.28)] transition hover:bg-(--color-primary-hover) md:bottom-8 md:right-8"
      aria-label="Open MedPin assistant"
    >
      <Bot className="h-6 w-6" strokeWidth={2.2} />
    </button>
  );
}
