import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginType, setLoginType] = useState('user') // 'user' or 'admin'
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTime, setLockTime] = useState(0)
  
  const router = useRouter()
const validateInputs = () => {
  if (isLocked) {
    const remainingTime = Math.ceil((lockTime - Date.now()) / 1000 / 60)
    setError(`Demasiados intentos. Intenta nuevamente en ${remainingTime} minutos.`)
    return false
  }
  
  if (formData.username.trim().length < 3) {
    setError('El usuario debe tener al menos 3 caracteres');
    return false;
  }
  
  if (formData.password.length < 8) {
    setError('La contraseña debe tener al menos 8 caracteres');
    return false;
  }
  
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(formData.username)) {
    setError('El usuario solo puede contener letras, números, guiones y guiones bajos');
    return false;
  }
  
  if (formData.password.length > 100) {
    setError('La contraseña es demasiado larga');
    return false;
  }
  
  if (formData.username.includes(' ')) {
    setError('El usuario no puede contener espacios');
    return false;
  }
  
  return true;
}

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
if (!validateInputs()) {
    return; 
  }
  
  setIsLoading(true)

    try {
      const endpoint = loginType === 'admin' ? '/api/auth/admin-login' : '/api/auth/login'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      
if (response.ok) {

setAttempts(0)
  setIsLocked(false)
  setLockTime(0)

  if (process.env.NODE_ENV === 'development') {
    console.log('Login exitoso')
    console.log('Rol del usuario:', data.user.role) // Solo información no sensible
  }
  
  sessionStorage.setItem('token', data.access_token)

const safeUserData = {
  id: data.user.id,
  username: data.user.username,
  role: data.user.role

  // NO incluir: password, email, datos personales
}
sessionStorage.setItem('user', JSON.stringify(safeUserData))
  
  // Redirigir según el rol
  if (data.user.role === 'admin') {
    console.log('Redirigiendo a admin dashboard...')
    router.push('/admin/dashboard')
  } else {
    console.log('Redirigiendo a dashboard normal...')
    router.push('/dashboard')
  }
} else {
 if (process.env.NODE_ENV === 'development') {
    console.log('Error en login:', data.error)
  }

const newAttempts = attempts + 1
  setAttempts(newAttempts)
  
  if (newAttempts >= 5) {
    const lockDuration = 5 * 60 * 1000 
    setIsLocked(true)
    setLockTime(Date.now() + lockDuration)
    
    setTimeout(() => {
      setIsLocked(false)
      setAttempts(0)
      setLockTime(0)
    }, lockDuration)
  }
  setError(data.error || 'Error al iniciar sesión')
}

    
    } catch {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            ProfesoresApp
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta para gestionar información académica
          </p>
        </div>

        {/* Login Type Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setLoginType('user')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              loginType === 'user'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Usuario
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              loginType === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Administrador
          </button>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ingresa tu usuario"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              `Iniciar Sesión como ${loginType === 'admin' ? 'Administrador' : 'Usuario'}`
            )}
          </button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

