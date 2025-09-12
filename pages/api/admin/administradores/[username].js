import { requireAdminAuth } from '../../../../lib/auth.js'
import { Administrador } from '../../../../models/Administrador.js'

export default async function handler(req, res) {
  try {
    // Verificar autenticación de admin
    const authResult = requireAdminAuth(req, res)
    if (authResult.error) {
      return res.status(authResult.status).json({ error: authResult.error })
    }

    const { username } = req.query

    if (req.method === 'PUT') {
      // Editar administrador
      const { password } = req.body

      if (!password) {
        return res.status(400).json({ error: 'Password es requerido' })
      }

      const updateData = {
        password_hash: await Administrador.hashPassword(password)
      }

      const result = await Administrador.updateByUsername(username, updateData)

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Administrador no encontrado' })
      }

      res.status(200).json({ mensaje: 'Administrador actualizado correctamente' })

    } else if (req.method === 'DELETE') {
      // Eliminar administrador
      // Verificar que no sea el último administrador
      const allAdmins = await Administrador.findAll()
      if (allAdmins.length <= 1) {
        return res.status(400).json({ error: 'No se puede eliminar el último administrador' })
      }

      const result = await Administrador.deleteByUsername(username)

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Administrador no encontrado' })
      }

      res.status(200).json({ mensaje: 'Administrador eliminado' })

    } else {
      res.status(405).json({ error: 'Método no permitido' })
    }

  } catch (error) {
    console.error('Error en gestión individual de administrador:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

