import 'dotenv/config'
import { Administrador } from '../models/Administrador.js'
import clientPromise from '../lib/mongodb.js'
import { fileURLToPath } from 'url'

async function initializeDatabase() {
  try {
    console.log('Inicializando base de datos...')

    // Conectar a MongoDB
    const client = await clientPromise
    const db = client.db('profesores')

    // Crear índices únicos
    console.log('Creando índices...')

    // Índices para profesores
    await db.collection('profesores').createIndex({ rfc: 1 }, { unique: true })
    await db.collection('profesores').createIndex({ curp: 1 }, { unique: true })
    await db.collection('profesores').createIndex({ correo: 1 }, { unique: true })
    await db.collection('profesores').createIndex({ username: 1 }, { unique: true })

    // Índices para administradores
    await db.collection('administradores').createIndex({ username: 1 }, { unique: true })

    console.log('Índices creados correctamente')

    // Crear administrador por defecto
    console.log('Verificando administrador por defecto...')

    const existingAdmin = await Administrador.findByUsername('admin')
    if (!existingAdmin) {
      const hashedPassword = await Administrador.hashPassword('admin123')
      const admin = new Administrador({
        username: 'admin',
        password_hash: hashedPassword
      })

      await admin.save()
      console.log('Administrador por defecto creado:')
      console.log('  Usuario: admin')
      console.log('  Contraseña: admin123')
      console.log('  ¡IMPORTANTE: Cambia esta contraseña después del primer login!')
    } else {
      console.log('Administrador por defecto ya existe')
    }

    console.log('Base de datos inicializada correctamente ✅')

  } catch (error) {
    console.error('Error inicializando base de datos:', error)
    process.exit(1)
  }
}

// Ejecutar si se llama directamente desde la terminal
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  initializeDatabase()
    .then(() => {
      console.log('Inicialización completada 🎉')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error durante la inicialización:', error)
      process.exit(1)
    })
}

export default initializeDatabase
