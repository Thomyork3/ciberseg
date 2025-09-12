import { Profesor } from '../../../models/Profesor.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const { 
      username, 
      password, 
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

    if (!username || !password || !nombre_completo || !correo) {
      return res.status(400).json({ error: 'Username, password, nombre completo y correo son requeridos' })
    }

    // Verificar si el profesor ya existe por username
    const existingProfesor = await Profesor.findByUsername(username)
    if (existingProfesor) {
      return res.status(400).json({ error: 'El profesor ya existe' })
    }

    // Verificar si ya existe un profesor con el mismo correo
    const existingEmail = await Profesor.findByEmail(correo)
    if (existingEmail) {
      return res.status(400).json({ error: 'Ya existe un profesor con este correo' })
    }

    // Verificar RFC si se proporciona
    if (rfc) {
      const existingRFC = await Profesor.findByRFC(rfc)
      if (existingRFC) {
        return res.status(400).json({ error: 'Ya existe un profesor con este RFC' })
      }
    }

    // Verificar CURP si se proporciona
    if (curp) {
      const existingCURP = await Profesor.findByCURP(curp)
      if (existingCURP) {
        return res.status(400).json({ error: 'Ya existe un profesor con este CURP' })
      }
    }

    // Hashear password
    const hashedPassword = await Profesor.hashPassword(password)

    // Crear profesor
    const profesor = new Profesor({
      username,
      password_hash: hashedPassword,
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
    })

    const result = await profesor.save()

    res.status(201).json({
      message: 'Profesor registrado exitosamente',
      profesorId: result.insertedId.toString()
    })

  } catch {
    console.error('Error en registro:')
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

