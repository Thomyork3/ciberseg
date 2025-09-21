import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { User, Mail, LogOut, AlertCircle } from 'lucide-react'

export default function UserDashboard() {
  const [user, setUser] = useState(null)
  const [profesorInfo, setProfesorInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchProfesorInfo = async (token) => {
      try {
        const response = await fetch('/api/mi-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProfesorInfo(data)
        } else if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/login')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Error al cargar información')
        }
      } catch {
        setError('Error de conexión')
      } finally {
        setIsLoading(false)
      }
    }

    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'profesor') {
      router.push('/login')
      return
    }

    setUser(parsedUser)
    fetchProfesorInfo(token)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">ProfesoresApp</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Bienvenido, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {profesorInfo ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-3 mr-4">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {profesorInfo.nombre_completo}
                  </h2>
                  <p className="text-blue-100">{profesorInfo.correo}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Información no disponible
            </h2>
            <p className="text-gray-600">
              No se encontró información de profesor asociada a tu cuenta. 
              Contacta al administrador para vincular tu perfil.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
