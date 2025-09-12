import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export function useAuth(requiredRole = null) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      if (!token || !userData) {
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)
        
        if (requiredRole) {
          router.push('/login')
        }
        return
      }

      const parsedUser = JSON.parse(userData)
      
      // Verificar si el rol es requerido y coincide
      if (requiredRole && parsedUser.role !== requiredRole) {
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)
        router.push('/login')
        return
      }

      setUser(parsedUser)
      setIsAuthenticated(true)
      setIsLoading(false)

    } catch (error) {
      console.error('Error checking auth:', error)
      setIsAuthenticated(false)
      setUser(null)
      setIsLoading(false)
      
      if (requiredRole) {
        router.push('/login')
      }
    }
  }

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/')
  }

  const getToken = () => {
    return localStorage.getItem('token')
  }

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = getToken()
    
    if (!token) {
      throw new Error('No token available')
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (response.status === 401) {
      logout()
      throw new Error('Session expired')
    }

    return response
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    getToken,
    makeAuthenticatedRequest,
    checkAuth
  }
}

