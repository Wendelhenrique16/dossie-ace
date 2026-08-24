// src/App.jsx
// Rotas do app. BrowserRouter fica no main.jsx (ver instruções).
// Autenticação real via Supabase Auth (sessão persistida pelo próprio SDK).

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Dashboard from './pages/Dashboard';
import AuthChoice from './pages/AuthChoice';
import Login from './pages/Login';
import Register from './pages/Register';
import CharacterList from './pages/CharacterList';
import CharacterCreate from './pages/CharacterCreate';
import ThemeToggle from './components/ThemeToggle';
import AppHeader from './components/AppHeader';
import AceOSBoot from './components/AceOSBoot';

function RequireAuth({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  return children;
}

function App() {
  const [session, setSession] = useState(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const isLoggedIn = !!session;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoaded(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  function handleLogout() {
    supabase.auth.signOut();
  }

  const userName = session?.user?.user_metadata?.name || session?.user?.email;

  // Evita piscar a tela de login antes da sessão salva carregar
  if (!sessionLoaded) return null;

  return (
    <div className="theme-root" data-theme={theme}>
      <AceOSBoot />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <div className="terminal-frame">
        <AppHeader userName={userName} onLogout={isLoggedIn ? handleLogout : undefined} />

        <div className="terminal-frame-content">
          <Routes>
            {/* Tela inicial — pública, não exige login */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Fluxo de autenticação */}
            <Route path="/auth" element={<AuthChoice />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protegidas */}
            <Route
              path="/characters"
              element={
                <RequireAuth isLoggedIn={isLoggedIn}>
                  <CharacterList userId={session?.user?.id} />
                </RequireAuth>
              }
            />
            <Route
              path="/characters/new"
              element={
                <RequireAuth isLoggedIn={isLoggedIn}>
                  <CharacterCreate userId={session?.user?.id} />
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