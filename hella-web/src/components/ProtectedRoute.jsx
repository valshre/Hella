import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ rolesPermitidos }) {
  // En la vida real, estos valores vienen de tu Contexto de Autenticación o Zustand
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); // 'Administrador', 'Chef' o 'Usuario'

  // Si no hay sesión iniciada, lo mandamos a loguearse
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si su rol no está en el arreglo de permitidos, le denegamos el acceso
  if (rolesPermitidos && !rolesPermitidos.includes(userRole)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  // Si todo está correcto, renderizamos la ruta hija
  return <Outlet />;
}