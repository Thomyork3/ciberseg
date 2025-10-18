import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

export class Profesor {
  constructor(data) {
    
    this.username = data.username
    this.password_hash = data.password_hash
    this.nombre_completo = data.nombre_completo
    this.correo = data.correo
    this.fecha_registro = new Date()
  }

  static async getCollection() {
    const client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    const db = client.db('profesores')
    return db.collection('profesores')
  }

  async save() {
    const collection = await Profesor.getCollection()
    const result = await collection.insertOne(this)
    return result
  }

  static async findByUsername(username) {
    const collection = await Profesor.getCollection()
    return await collection.findOne({ username })
  }

  static async findByEmail(correo) {
    const collection = await Profesor.getCollection()
    return await collection.findOne({ correo })
  }

  //  para obtener todos los profesores
  static async findAll() {
    const collection = await Profesor.getCollection()
    return await collection.find({}).toArray()
  }

  //  para encontrar por ID
  static async findById(id) {
    const collection = await Profesor.getCollection()
    const { ObjectId } = require('mongodb')
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  // para eliminar por ID
  static async deleteById(id) {
    const collection = await Profesor.getCollection()
    const { ObjectId } = require('mongodb')
    return await collection.deleteOne({ _id: new ObjectId(id) })
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10)
  }

  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash)
  }
}
