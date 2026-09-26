import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
export default function ProtectedRoute(){const {user,loading}=useAuth();if(loading)return <div className="min-h-screen grid place-items-center bg-[#09090b] text-white/60">Checking session...</div>;return user?<Outlet/>:<Navigate to="/admin/login" replace/>}
