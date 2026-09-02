// src/components/ThemeToggle.jsx
export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-4 right-4 md:bottom-auto md:top-4 md:right-4 z-[60] px-3 py-1.5 text-xs shadow-lg md:shadow-none backdrop-blur-sm"
    >
      {theme === 'dark' ? '☀ Modo Claro' : '● Modo Escuro'}
    </button>
  );
}