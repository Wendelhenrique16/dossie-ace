// src/components/ThemeToggle.jsx
export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{ position: 'fixed', top: 16, right: 16, zIndex: 60 }}
      className="px-3 py-1.5 text-xs"
    >
      {theme === 'dark' ? '☀ Modo Claro' : '● Modo Escuro'}
    </button>
  );
}