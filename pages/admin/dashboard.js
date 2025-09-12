
/* eslint-disable no-unused-vars */
import { useState, useEffect} from 'react'
import { useRouter } from 'next/router'


import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Search,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('profesores')
  const [profesores, setProfesores] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [administradores, setAdministradores] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'profesor', 'usuario', 'admin'
  const [editingItem, setEditingItem] = useState(null)
  const [profesor, setProfesor] = useState(null)
  
  const router = useRouter()

  const fetchData = async (token) => {
    try {
      setIsLoading(true)
      
      // Fetch profesores
      const profesoresRes = await fetch('/api/admin/profesores', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (profesoresRes.ok) {
        const profesoresData = await profesoresRes.json()
        setProfesores(profesoresData)
      }

      // Fetch usuarios
      const usuariosRes = await fetch('/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (usuariosRes.ok) {
        const usuariosData = await usuariosRes.json()
        setUsuarios(usuariosData)
      }

      // Fetch administradores
      const adminsRes = await fetch('/api/admin/administradores', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (adminsRes.ok) {
        const adminsData = await adminsRes.json()
        setAdministradores(adminsData)
      }

    } catch  {
      setError('Error al cargar datos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const profesorData = localStorage.getItem('profesor')

    if (!token || !profesorData) {
      router.push('/login')
      return
    }

    const parsedProfesor = JSON.parse(profesorData)
    if (parsedProfesor.role !== 'admin') {
      router.push('/login')
      return
    }

    setProfesor(parsedProfesor)
    setUser(parsedProfesor)
    fetchData(token)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const handleDelete = async (type, id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      return
    }

    const token = localStorage.getItem('token')
    let endpoint = ''
    
    switch (type) {
      case 'profesor':
        endpoint = `/api/admin/profesores/${id}`
        break
      case 'usuario':
        endpoint = `/api/admin/usuarios/${id}`
        break
      case 'admin':
        endpoint = `/api/admin/administradores/${id}`
        break
    }

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setSuccess('Elemento eliminado correctamente')
        fetchData(token)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al eliminar')
      }
    } catch  {
      setError('Error de conexión')
    }
  }

  const openModal = (type, item = null) => {
    setModalType(type)
    setEditingItem(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setEditingItem(null)
  }

  const filteredProfesores = profesores.filter(profesor =>
    profesor.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profesor.correo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAdministradores = administradores.filter(admin =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin: {user?.username}</span>
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
        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">×</button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-400 hover:text-green-600">×</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Profesores</p>
                <p className="text-2xl font-bold text-gray-900">{profesores.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">{administradores.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profesores')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profesores'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profesores
              </button>
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'usuarios'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Usuarios
              </button>
              <button
                onClick={() => setActiveTab('administradores')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'administradores'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Administradores
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Search and Add */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => openModal(activeTab.slice(0, -1))}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar {activeTab.slice(0, -1)}
              </button>
            </div>

            {/* Tables */}
            {activeTab === 'profesores' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Correo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProfesores.map((profesor) => (
                      <tr key={profesor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {profesor.nombre_completo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {profesor.correo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {profesor.categoria}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {profesor.grado_academico}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openModal('profesor', profesor)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('profesor', profesor.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'usuarios' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profesor ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Creación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsuarios.map((usuario) => (
                      <tr key={usuario.username}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {usuario.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {usuario.profesor_id || 'No asignado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(usuario.created_at).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openModal('usuario', usuario)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('usuario', usuario.username)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'administradores' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Creación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAdministradores.map((admin) => (
                      <tr key={admin.username}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {admin.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(admin.created_at).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openModal('administrador', admin)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('admin', admin.username)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal placeholder - would need to implement forms for each type */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar' : 'Agregar'} {modalType}
            </h3>
            <p className="text-gray-600 mb-4">
              Funcionalidad de formulario pendiente de implementación
            </p>
            <button
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

