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
      correo
    } = req.body

    // campos requeridos
    if (!username || !password || !nombre_completo || !correo) {
      return res.status(400).json({ error: 'Username, password, nombre completo y correo son requeridos' })
    }

    
    const existingProfesor = await Profesor.findByUsername(username)
    if (existingProfesor) {
      return res.status(400).json({ error: 'El profesor ya existe' })
    }

    
    const existingEmail = await Profesor.findByEmail(correo)
    if (existingEmail) {
      return res.status(400).json({ error: 'Ya existe un profesor con este correo' })
    }

    
    const hashedPassword = await Profesor.hashPassword(password)

    // Crear profesor
    const profesor = new Profesor({
      username,
      password_hash: hashedPassword,
      nombre_completo,
      correo
    })

    const result = await profesor.save()

    res.status(201).json({
      message: 'Profesor registrado exitosamente',
      profesorId: result.insertedId.toString()
    })

  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

