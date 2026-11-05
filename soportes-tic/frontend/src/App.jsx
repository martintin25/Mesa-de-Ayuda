import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { SoporteList } from './components/SoporteList';
import { AdminDashboard } from './components/AdminDashboard';
import { TecnicoDashboard } from './components/TecnicoDashboard';
import { ClienteDashboard } from './components/ClienteDashboard';
import { Landing, AuthShell } from './components/Landing';
import { CookieBanner } from './components/Legal';
import { ROLES } from './config/constants';
import './index.css';

const RUTA_POR_ROL = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.TECNICO]: '/tecnico',
  [ROLES.SOLICITANTE]: '/cliente',
  [ROLES.COORDINADOR]: '/soportes',
};

const rutaDeRol = (rol) => RUTA_POR_ROL[rol] ?? '/';

// Solo entra con sesión y con el rol permitido. Si no, vuelve a la portada.
const RutaProtegida = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.rol)) return <Navigate to="/" replace />;
  return children;
};

const PaginaLanding = () => {
  const navigate = useNavigate();
  return (
    <Landing
      onLogin={() => navigate('/login')}
      onRegister={() => navigate('/registro')}
    />
  );
};

const PaginaAuth = ({ modo }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Si ya hay sesión, va directo a su panel
  if (user) return <Navigate to={rutaDeRol(user.rol)} replace />;

  return (
    <AuthShell onBack={() => navigate('/')}>
      {modo === 'login' ? (
        <Login onSwitchToRegister={() => navigate('/registro')} />
      ) : (
        <Register onSwitchToLogin={() => navigate('/login')} />
      )}
    </AuthShell>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PaginaLanding />} />
        <Route path="/login" element={<PaginaAuth modo="login" />} />
        <Route path="/registro" element={<PaginaAuth modo="registro" />} />
        <Route
          path="/admin"
          element={<RutaProtegida roles={[ROLES.ADMIN]}><AdminDashboard /></RutaProtegida>}
        />
        <Route
          path="/tecnico"
          element={<RutaProtegida roles={[ROLES.TECNICO]}><TecnicoDashboard /></RutaProtegida>}
        />
        <Route
          path="/cliente"
          element={<RutaProtegida roles={[ROLES.SOLICITANTE]}><ClienteDashboard /></RutaProtegida>}
        />
        <Route
          path="/soportes"
          element={<RutaProtegida roles={[ROLES.COORDINADOR]}><SoporteList /></RutaProtegida>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieBanner />
    </AuthProvider>
  );
}