import { requireAdminAuth } from '../../../../lib/auth.js'
import { Profesor } from '../../../../models/Profesor.js'

export default async function handler(req, res) {
  try {
    // Verificar autenticación de admin
    const authResult = requireAdminAuth(req, res)
    if (authResult.error) {
      return res.status(authResult.status).json({ error: authResult.error })
    }

    if (req.method === 'GET') {
      // Listar todos los profesores
      const profesores = await Profesor.findAll()
      
      const response = profesores.map(profesor => ({
        id: profesor._id.toString(),
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
        direccion: profesor.direccion
      }))

      res.status(200).json(response)

    } else if (req.method === 'POST') {
      // Crear nuevo profesor
      const {
        nombre_completo,
        genero,
        rfc,
        curp,
        categoria,
        grado_academico,
        antig_carrera,
        antig_unam,
        correo,
        tel_casa,
        celular,
        direccion
      } = req.body

      // Validaciones básicas
      if (!nombre_completo || !genero || !rfc || !curp || !categoria || !grado_academico || !correo) {
        return res.status(400).json({ error: 'Faltan campos requeridos' })
      }

      // Verificar que no exista un profesor con el mismo RFC o CURP
      const existingRFC = await Profesor.findByRFC(rfc)
      if (existingRFC) {
        return res.status(400).json({ error: 'Ya existe un profesor con este RFC' })
      }

      const existingCURP = await Profesor.findByCURP(curp)
      if (existingCURP) {
        return res.status(400).json({ error: 'Ya existe un profesor con este CURP' })
      }

      const profesor = new Profesor({
        nombre_completo,
        genero,
        rfc,
        curp,
        categoria,
        grado_academico,
        antig_carrera: new Date(antig_carrera),
        antig_unam: new Date(antig_unam),
        correo,
        tel_casa,
        celular,
        direccion
      })

      const result = await profesor.save()

      res.status(201).json({
        mensaje: 'Profesor creado',
        id: result.insertedId.toString()
      })

    } else {
      res.status(405).json({ error: 'Método no permitido' })
    }

  } catch (error) {
    console.error('Error en gestión de profesores:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

