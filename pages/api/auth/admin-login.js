import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import { createToken } from '../../../lib/auth.js'

const MONGODB_URI = process.env.MONGODB_URI

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const { username, password } = req.body
    
    console.log('=== DEBUG ADMIN LOGIN ===')
    console.log('Username recibido:', username)
    console.log('Password recibido:', password)
    console.log('MONGODB_URI:', MONGODB_URI ? 'CONFIGURADO' : 'NO CONFIGURADO')

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' })
    }

    // Conectar directamente a MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    
    // 👇 Conectarse a la DB correcta
    const db = client.db('profesores')
    
    // Listar todas las colecciones de la DB "profesores"
    const collections = await db.listCollections().toArray()
    console.log('Colecciones disponibles en "profesores":', collections.map(c => c.name))
    
    // Buscar admin en la colección correcta
    const possibleCollections = ['administradores', 'admins', 'users', 'usuarios']
    let admin = null
    let foundInCollection = null
    
    for (const collectionName of possibleCollections) {
      if (!collections.some(c => c.name === collectionName)) continue
      console.log(`Buscando en colección: ${collectionName}`)
      const result = await db.collection(collectionName).findOne({ username })
      if (result) {
        admin = result
        foundInCollection = collectionName
        console.log(`¡Admin encontrado en colección: ${collectionName}!`)
        break
      }
    }
    
    if (!admin) {
      await client.close()
      return res.status(400).json({ error: 'Usuario no encontrado en ninguna colección' })
    }

    console.log('Admin encontrado:', admin.username)
    console.log('Colección:', foundInCollection)
    console.log('Password hash en DB:', admin.password_hash)
    console.log('Rol en DB:', admin.role || admin.rol || 'NO DEFINIDO')

    // Verificar password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    console.log('Password válido:', isValidPassword)
    
    if (!isValidPassword) {
      await client.close()
      return res.status(400).json({ error: 'Contraseña incorrecta' })
    }

    // Crear token
    const token = createToken({
      sub: admin.username,
      role: 'admin',
      userId: admin._id.toString()
    })

    await client.close()
    console.log('Login exitoso, enviando respuesta...')

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
