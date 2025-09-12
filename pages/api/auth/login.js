import { Profesor } from '../../../models/Profesor.js'
import { createToken } from '../../../lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' })
    }

    // Buscar profesor
    const profesor = await Profesor.findByUsername(username)
    if (!profesor) {
      return res.status(400).json({ error: 'Credenciales incorrectas' })
    }

    // Verificar password
    const isValidPassword = await Profesor.verifyPassword(password, profesor.password_hash)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Credenciales incorrectas' })
    }

    // Crear token
    const token = createToken({
      sub: profesor.username,
      role: 'profesor',
      userId: profesor._id.toString(),
      profesorId: profesor._id.toString()
    })

    res.status(200).json({
      access_token: token,
      token_type: 'bearer',
      user: {
        username: profesor.username,
        role: 'profesor',
        profesorId: profesor._id.toString(),
        nombre_completo: profesor.nombre_completo
      }
    })

  } catch {
    console.error('Error en login:')
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

