import { Administrador } from '../../../models/Administrador.js'
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

    // Buscar administrador
    const admin = await Administrador.findByUsername(username)
    if (!admin) {
      return res.status(400).json({ error: 'Credenciales incorrectas' })
    }

    // Verificar password
    const isValidPassword = await Administrador.verifyPassword(password, admin.password_hash)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Credenciales incorrectas' })
    }

    // Crear token
    const token = createToken({
      sub: admin.username,
      role: 'admin',
      userId: admin._id.toString()
    })

    res.status(200).json({
      access_token: token,
      token_type: 'bearer',
      user: {
        username: admin.username,
        role: 'admin'
      }
    })

  } catch (error) {
    console.error('Error en admin login:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

