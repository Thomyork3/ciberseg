import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, LogOut, AlertCircle } from 'lucide-react'

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
    if (parsedUser.role !== 'user') {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado'
    return new Date(dateString).toLocaleDateString('es-ES')
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <p className="text-blue-100">
                    {profesorInfo.categoria} - {profesorInfo.grado_academico}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Información Personal
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Género</p>
                        <p className="font-medium">{profesorInfo.genero}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Correo Electrónico</p>
                        <p className="font-medium">{profesorInfo.correo}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Teléfono Casa</p>
                        <p className="font-medium">{profesorInfo.tel_casa || 'No especificado'}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Celular</p>
                        <p className="font-medium">{profesorInfo.celular || 'No especificado'}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Dirección</p>
                        <p className="font-medium">{profesorInfo.direccion || 'No especificada'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información Académica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Información Académica
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <GraduationCap className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Grado Académico</p>
                        <p className="font-medium">{profesorInfo.grado_academico}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Categoría</p>
                        <p className="font-medium">{profesorInfo.categoria}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Antigüedad en Carrera</p>
                        <p className="font-medium">{formatDate(profesorInfo.antig_carrera)}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Antigüedad en UNAM</p>
                        <p className="font-medium">{formatDate(profesorInfo.antig_unam)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información Legal */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Información Legal
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">RFC</p>
                      <p className="font-medium font-mono">{profesorInfo.rfc}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">CURP</p>
                      <p className="font-medium font-mono">{profesorInfo.curp}</p>
                    </div>
                  </div>
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

