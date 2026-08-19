// src/App.jsx
// Rotas do app. BrowserRouter fica no main.jsx (ver instruções).
// Autenticação ainda é só um estado em memória — reseta ao dar F5.
// TODO: trocar por sessão real do Supabase Auth quando integrar o backend.

import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CharacterList from './pages/CharacterList';
import CharacterCreate from './pages/CharacterCreate';
import ThemeToggle from './components/ThemeToggle';
import AppHeader from './components/AppHeader';

function RequireAuth({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null); // { name, email } | null
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const isLoggedIn = !!user;

  return (
    <div className="theme-root" data-theme={theme}>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <div className="terminal-frame">
        <AppHeader userName={user?.name} />

        <div className="terminal-frame-content">
          <Routes>
            <Route path="/login" element={<Login onLogin={setUser} />} />

            <Route
              path="/dashboard"
              element={
                <RequireAuth isLoggedIn={isLoggedIn}>
                  <Dashboard />
                </RequireAuth>
              }
            />

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

            {/* Qualquer rota desconhecida cai no dashboard (se logado) ou no login */}
            <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;