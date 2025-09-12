import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isLoading, isAuthenticated } = useAuth(requiredRole)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  return children
}

// HOC para proteger páginas específicas
export function withAuth(WrappedComponent, requiredRole = null) {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    )
  }
}

// Componente específico para rutas de admin
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  )
}

// Componente específico para rutas de usuario
export function UserRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="user">
      {children}
    </ProtectedRoute>
  )
}

