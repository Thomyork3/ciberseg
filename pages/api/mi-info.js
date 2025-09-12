import { requireUserAuth } from '../../lib/auth.js'
import { Profesor } from '../../models/Profesor.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    // Verificar autenticación
    const authResult = requireUserAuth(req, res)
    if (authResult.error) {
      return res.status(authResult.status).json({ error: authResult.error })
    }

    const { user } = authResult

    // Buscar profesor por username
    const profesor = await Profesor.findByUsername(user.sub)
    
    if (!profesor) {
      return res.status(404).json({ error: 'Profesor no encontrado' })
    }

    // Formatear respuesta (sin incluir información sensible como password_hash)
    const response = {
      id: profesor._id.toString(),
      username: profesor.username,
      nombre_completo: profesor.nombre_completo,
      genero: profesor.genero,
      rfc: profesor.rfc,
      curp: profesor.curp,
      categoria: profesor.categoria,
      grado_academico: profesor.grado_academico,
      antig_carrera: profesor.antig_carrera,
      antig_unam: profesor.antig_unam,
      correo: profesor.correo,
      tel_casa: profesor.tel_casa,
      celular: profesor.celular,
      direccion: profesor.direccion,
      role: profesor.role,
      created_at: profesor.created_at,
      updated_at: profesor.updated_at
    }

    res.status(200).json(response)

  } catch (error) {
    console.error('Error al obtener información:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

