import { requireAdminAuth } from '../../../../lib/auth.js'
import { Profesor } from '../../../../models/Profesor.js'

export default async function handler(req, res) {
  try {
    // Verificar autenticación de admin
    const authResult = requireAdminAuth(req, res)
    if (authResult.error) {
      return res.status(authResult.status).json({ error: authResult.error })
    }

    const { id } = req.query

    if (req.method === 'PUT') {
      // Editar profesor
      const updateData = {}
      const allowedFields = [
        'nombre_completo', 'genero', 'rfc', 'curp', 'categoria',
        'grado_academico', 'antig_carrera', 'antig_unam', 'correo',
        'tel_casa', 'celular', 'direccion'
      ]

      // Solo incluir campos que se enviaron
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          if (field === 'antig_carrera' || field === 'antig_unam') {
            updateData[field] = new Date(req.body[field])
          } else {
            updateData[field] = req.body[field]
          }
        }
      })

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos a actualizar' })
      }

      // Verificar que el profesor existe
      const profesor = await Profesor.findById(id)
      if (!profesor) {
        return res.status(404).json({ error: 'Profesor no encontrado' })
      }

      // Verificar RFC y CURP únicos si se están actualizando
      if (updateData.rfc && updateData.rfc !== profesor.rfc) {
        const existingRFC = await Profesor.findByRFC(updateData.rfc)
        if (existingRFC) {
          return res.status(400).json({ error: 'Ya existe un profesor con este RFC' })
        }
      }

      if (updateData.curp && updateData.curp !== profesor.curp) {
        const existingCURP = await Profesor.findByCURP(updateData.curp)
        if (existingCURP) {
          return res.status(400).json({ error: 'Ya existe un profesor con este CURP' })
        }
      }

      const result = await Profesor.updateById(id, updateData)

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Profesor no encontrado' })
      }

      return res.status(200).json({ mensaje: 'Profesor actualizado' })

    } else if (req.method === 'DELETE') {
      // Eliminar profesor
      const result = await Profesor.deleteById(id)

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Profesor no encontrado' })
      }

      return res.status(200).json({ mensaje: 'Profesor eliminado' })

    } else {
      return res.status(405).json({ error: 'Método no permitido' })
    }

  } catch (error) {
    console.error('Error en gestión individual de profesor:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
