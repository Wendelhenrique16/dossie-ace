// src/App.jsx
// Rotas do app. BrowserRouter fica no main.jsx (ver instruções).
// Autenticação ainda é só um estado em memória — reseta ao dar F5.
// TODO: trocar por sessão real do Supabase Auth quando integrar o backend.

import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AuthChoice from './pages/AuthChoice';
import Login from './pages/Login';
import Register from './pages/Register';
import CharacterList from './pages/CharacterList';
import CharacterCreate from './pages/CharacterCreate';
import ThemeToggle from './components/ThemeToggle';
import AppHeader from './components/AppHeader';

function RequireAuth({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null); // { name?, email } | null
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const isLoggedIn = !!user;

  return (
    <div className="theme-root" data-theme={theme}>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <div className="terminal-frame">
        <AppHeader userName={user?.name || user?.email} />

        <div className="terminal-frame-content">
          <Routes>
            {/* Tela inicial — pública, não exige login */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Fluxo de autenticação */}
            <Route path="/auth" element={<AuthChoice />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register onLogin={setUser} />} />

            {/* Protegidas */}
            <Route
              path="/characters"
              element={
                <RequireAuth isLoggedIn={isLoggedIn}>
                  <CharacterList />
                </RequireAuth>
              }
            />
            <Route
              path="/characters/new"
              element={
                <RequireAuth isLoggedIn={isLoggedIn}>
                  <CharacterCreate />
                </RequireAuth>
              }
            />

            {/* Qualquer rota desconhecida cai na tela inicial */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;