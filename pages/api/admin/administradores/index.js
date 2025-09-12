import { requireAdminAuth } from '../../../../lib/auth.js'
import { Administrador } from '../../../../models/Administrador.js'

export default async function handler(req, res) {
  try {
    // Verificar autenticación de admin
    const authResult = requireAdminAuth(req, res)
    if (authResult.error) {
      return res.status(authResult.status).json({ error: authResult.error })
    }

    if (req.method === 'GET') {
      // Listar todos los administradores
      const administradores = await Administrador.findAll()
      
      const response = administradores.map(admin => ({
        username: admin.username,
        role: admin.role,
        created_at: admin.created_at
      }))

      res.status(200).json(response)

    } else if (req.method === 'POST') {
      // Crear nuevo administrador
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ error: 'Username y password son requeridos' })
      }

      // Verificar si el administrador ya existe
      const existingAdmin = await Administrador.findByUsername(username)
      if (existingAdmin) {
        return res.status(400).json({ error: 'El administrador ya existe' })
      }

      // Hashear password
      const hashedPassword = await Administrador.hashPassword(password)

      // Crear administrador
      const administrador = new Administrador({
        username,
        password_hash: hashedPassword
      })

      const result = await administrador.save()

      res.status(201).json({
        mensaje: 'Administrador creado exitosamente',
        adminId: result.insertedId.toString()
      })

    } else {
      res.status(405).json({ error: 'Método no permitido' })
    }

  } catch (error) {
    console.error('Error en gestión de administradores:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

