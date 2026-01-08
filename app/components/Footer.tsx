// components/FooterBlur.tsx
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-40 backdrop-blur-lg bg-gradient-to-t from-white/70 via-white/30 to-transparent dark:from-neutral-900/70 dark:via-neutral-900/30 dark:to-transparent transition-colors duration-300">
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <ThemeToggle />
      </div>
    </footer>
  );
}
