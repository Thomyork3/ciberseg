import { verifyToken } from '../lib/auth.js'

export function withAuth(handler, requiredRole = null) {
  return async (req, res) => {
    try {
      // Verificar que el token esté presente
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' })
      }

      const token = authHeader.substring(7)
      
      // Verificar y decodificar el token
      const decoded = verifyToken(token)
      if (!decoded) {
        return res.status(401).json({ error: 'Token inválido o expirado' })
      }

      // Verificar el rol si es requerido
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: 'Permisos insuficientes' })
      }

      // Agregar la información del usuario a la request
      req.user = decoded

      // Continuar con el handler original
      return handler(req, res)

    } catch (error) {
      console.error('Error en middleware de autenticación:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}

export function withAdminAuth(handler) {
  return withAuth(handler, 'admin')
}

export function withUserAuth(handler) {
  return withAuth(handler, 'user')
}

export function corsMiddleware(req, res, next) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (next) {
    next()
  }
}

export function validateRequest(schema) {
  return (handler) => {
    return async (req, res) => {
      try {
        // Validar el cuerpo de la request según el schema
        if (req.method === 'POST' || req.method === 'PUT') {
          const validation = schema.safeParse(req.body)
          if (!validation.success) {
            return res.status(400).json({ 
              error: 'Datos inválidos',
              details: validation.error.errors
            })
          }
          req.validatedData = validation.data
        }

        return handler(req, res)
      } catch (error) {
        console.error('Error en validación:', error)
        return res.status(500).json({ error: 'Error interno del servidor' })
      }
    }
  }
}

export function rateLimitMiddleware(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  const requests = new Map()

  return (handler) => {
    return async (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      const now = Date.now()
      const windowStart = now - windowMs

      // Limpiar requests antiguos
      for (const [key, timestamps] of requests.entries()) {
        const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart)
        if (validTimestamps.length === 0) {
          requests.delete(key)
        } else {
          requests.set(key, validTimestamps)
        }
      }

      // Verificar límite para esta IP
      const ipRequests = requests.get(ip) || []
      if (ipRequests.length >= maxRequests) {
        return res.status(429).json({ error: 'Demasiadas solicitudes' })
      }

      // Agregar esta request
      ipRequests.push(now)
      requests.set(ip, ipRequests)

      return handler(req, res)
    }
  }
}

export function loggerMiddleware(handler) {
  return async (req, res) => {
    const start = Date.now()
    
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    
    try {
      const result = await handler(req, res)
      const duration = Date.now() - start
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`)
      return result
    } catch (error) {
      const duration = Date.now() - start
      console.error(`${new Date().toISOString()} - ${req.method} ${req.url} - ERROR - ${duration}ms`, error)
      throw error
    }
  }
}

