import Link from 'next/link'
import { Users, Shield, Database } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Gestión de Profesores",
      description: "Sistema completo para administrar información de profesores universitarios"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Autenticación Segura",
      description: "Sistema de roles con autenticación JWT para usuarios y administradores"
    },
    {
      icon: <Database className="w-8 h-8 text-purple-600" />,
      title: "Base de Datos en la Nube",
      description: "Almacenamiento seguro y escalable con MongoDB Cloud"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Flex en columna: logo arriba, botones abajo, cada uno en su línea */}
          <div className="flex flex-col items-center py-6">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-4">
              ProfesoresApp
            </h1>
            <Link
              href="/login"
              className="w-full max-w-xs text-center px-5 py-2 mb-3 font-medium text-blue-600
                         border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white
                         transition-colors transition-transform hover:scale-105 shadow-sm"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="w-full max-w-xs inline-flex items-center justify-center px-5 py-2
                         font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-500
                         rounded-lg shadow-lg hover:shadow-2xl transition-transform hover:scale-105"
            >
              Regístrate Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Gestión Inteligente de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              Profesores
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            La plataforma definitiva para administrar datos académicos y profesionales.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar información académica de manera eficiente y segura
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 text-center bg-gray-50 rounded-xl transition-all
                           hover:bg-gray-100 transform hover:scale-105"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">ProfesoresApp</h3>
          <p className="text-gray-400 text-sm">
            © 2024 ProfesoresApp. Desarrollado con Next.js y MongoDB.
          </p>
        </div>
      </footer>
    </div>
  )
}
