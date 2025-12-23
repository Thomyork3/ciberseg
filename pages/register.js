import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Eye, EyeOff, User, Lock, AlertCircle, CheckCircle } from 'lucide-react'

const sanitizeInput = (input) => {
  return input.trim().replace(/[<>&"']/g, '')
}

const validateEmailAdvanced = (email) => {
 
  const cleanEmail = email.trim().toLowerCase()
  
  
  if (!cleanEmail) return { isValid: false, error: 'El correo es requerido' }
  if (cleanEmail.length > 254) return { isValid: false, error: 'El correo es demasiado largo' }
  if (cleanEmail.length < 5) return { isValid: false, error: 'El correo es demasiado corto' }
  
 
  if (cleanEmail.indexOf('@') === -1) return { isValid: false, error: 'Falta el símbolo @' }
  
  const parts = cleanEmail.split('@')
  const localPart = parts[0]
  const domainPart = parts[1]
  
 
  if (localPart.length === 0) return { isValid: false, error: 'Falta la parte local del correo' }
  if (localPart.length > 64) return { isValid: false, error: 'La parte local es demasiado larga' }
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
    return { isValid: false, error: 'Caracteres inválidos en la parte local' }
  }
  

  if (!domainPart) return { isValid: false, error: 'Falta el dominio' }
  if (domainPart.length < 3) return { isValid: false, error: 'Dominio demasiado corto' }
  if (!/\./.test(domainPart)) return { isValid: false, error: 'Falta el punto en el dominio' }
  if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) return { isValid: false, error: 'Caracteres inválidos en el dominio' }
  

  const domainParts = domainPart.split('.')
  const tld = domainParts[domainParts.length - 1]
  if (tld.length < 2) return { isValid: false, error: 'TLD demasiado corto' }
  
  return { isValid: true, error: null }
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nombre_completo: '',
    correo: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')

  const router = useRouter()

const handleChange = (e) => {
  const { name, value } = e.target
  const sanitizedValue = sanitizeInput(value)
  
  setFormData({
    ...formData,
    [name]: sanitizedValue
  })

if (name === 'correo') {
    if (sanitizedValue) {
      const validation = validateEmailAdvanced(sanitizedValue)
      setEmailError(validation.error || '')
      setIsEmailValid(validation.isValid)
    } else {
      setEmailError('')
      setIsEmailValid(false)
    }
  }
  
  
  if (name === 'password') {
    if (sanitizedValue.length === 0) {
      setPasswordStrength('')
    } else if (sanitizedValue.length >= 8 && /[A-Z]/.test(sanitizedValue) && /[a-z]/.test(sanitizedValue) && /\d/.test(sanitizedValue)) {
      setPasswordStrength('strong')
    } else {
      setPasswordStrength('weak')
    }
  }
  
  setError('')
}

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword || !formData.nombre_completo || !formData.correo) {
      setError('Todos los campos son requeridos')
      return false
    }


    if (formData.username.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres')
      return false
    }

  if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
    setError('El usuario solo puede contener letras, números y guiones bajos')
    return false
  }

  if (formData.nombre_completo.length < 2) {
    setError('El nombre completo debe tener al menos 2 caracteres')
    return false
  }

  const emailValidation = validateEmailAdvanced(formData.correo)
  if (!emailValidation.isValid) {
    setError(emailValidation.error)
    return false
  }

  if (formData.password.length < 8) {
    setError('La contraseña debe tener al menos 8 caracteres')
    return false
  }

  if (!/[A-Z]/.test(formData.password)) {
    setError('La contraseña debe incluir al menos una mayúscula')
    return false
  }

  if (!/[a-z]/.test(formData.password)) {
    setError('La contraseña debe incluir al menos una minúscula')
    return false
  }

  if (!/\d/.test(formData.password)) {
    setError('La contraseña debe incluir al menos un número')
    return false
  }


    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
	username: formData.username.toLowerCase().trim(),
        password: formData.password,
        nombre_completo: formData.nombre_completo.trim(),
        correo: formData.correo.toLowerCase().trim()
        }),

      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.error || 'Error al registrar usuario')
      }
    } catch {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Registro Exitoso!
            </h2>
            <p className="text-gray-600 mb-4">
              Tu cuenta ha sido creada correctamente. Serás redirigido al login en unos segundos.
            </p>
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Ir al login ahora
            </Link>
          </div>
        </div>
      </div>
    )
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
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a nuestra plataforma de gestión académica
          </p>
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
                  placeholder="Elige un nombre de usuario"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Mínimo 3 caracteres
              </p>
            </div>
            {/* Nombre Completo */}
            <div>
              <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nombre_completo"
                  name="nombre_completo"
                  type="text"
                  required
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            {/* Correo */}
            <div>
  <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
    Correo Electrónico
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Mail className="h-5 w-5 text-gray-400" /> {/* ← Cambiar User por Mail */}
    </div>
    <input
      id="correo"
      name="correo"
      type="email"
      required
      value={formData.correo}
      onChange={handleChange}
      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
        emailError ? 'border-red-300 focus:ring-red-500' : 
        isEmailValid ? 'border-green-300 focus:ring-green-500' : 
        'border-gray-300 focus:ring-blue-500'
      }`}
      placeholder="tu@correo.com"
    />
    {isEmailValid && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <CheckCircle className="h-5 w-5 text-green-500" />
      </div>
    )}
  </div>
  {emailError && (
    <p className="mt-1 text-xs text-red-600">{emailError}</p>
  )}
  {isEmailValid && (
    <p className="mt-1 text-xs text-green-600">✓ Correo válido</p>
  )}
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
                  placeholder="Crea una contraseña segura"
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
              <p className="mt-1 text-xs text-gray-500">
                Mínimo 6 caracteres
              </p>
            </div>

 {formData.password && (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">Fortaleza de la contraseña:</span>
        <span className={`text-xs font-medium ${
          passwordStrength === 'strong' ? 'text-green-600' : 
          passwordStrength === 'weak' ? 'text-red-600' : 'text-gray-500'
        }`}>
          {passwordStrength === 'strong' ? 'Fuerte' : 
           passwordStrength === 'weak' ? 'Débil' : 'Ingresa contraseña'}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all ${
          passwordStrength === 'strong' ? 'bg-green-500 w-full' : 
          passwordStrength === 'weak' ? 'bg-red-500 w-1/3' : 'bg-gray-300 w-0'
        }`}></div>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Mínimo 8 caracteres con mayúsculas, minúsculas y números
      </p>
    </div>
  )}
</div>
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Confirma tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
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
                Creando cuenta...
              </div>
            ) : (
              'Crear Cuenta'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Inicia sesión aquí
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

