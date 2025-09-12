import 'dotenv/config'
import clientPromise from '../lib/mongodb.js'

async function runQueries() {
  try {
    console.log('🔌 Conectando a MongoDB...')
    const client = await clientPromise
    const db = client.db('profesores')

    console.log('✅ Conectado, ahora listando administradores...')

    const admins = await db.collection('administradores').find().toArray()

    if (admins.length === 0) {
      console.log('⚠️ No hay administradores en la colección.')
    } else {
      console.log('📋 Administradores encontrados:')
      console.log(admins)
    }

  } catch (error) {
    console.error('❌ Error en queries:', error)
  } finally {
    process.exit(0)
  }
}

runQueries()
