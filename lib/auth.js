/* eslint-env node */

import jwt from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura'

const ACCESS_TOKEN_EXPIRE_MINUTES = 30

export function createToken(payload) {
  const expiresIn = ACCESS_TOKEN_EXPIRE_MINUTES * 60 // en segundos
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch  {
    return null
  }
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export function requireAuth(req, res, requiredRole = null) {
  const token = getTokenFromRequest(req)
  
  if (!token) {
    return { error: 'Token no proporcionado', status: 401 }
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return { error: 'Token inválido', status: 401 }
  }

  if (requiredRole && decoded.role !== requiredRole) {
    return { error: 'Permisos insuficientes', status: 403 }
  }

  return { user: decoded }
}

export function requireProfesorAuth(req, res) {
  return requireAuth(req, res, 'profesor')
}

export function requireUserAuth(req, res) {
  return requireAuth(req, res, 'profesor')
}

export function requireAdminAuth(req, res) {
  return requireAuth(req, res, 'admin')
}

