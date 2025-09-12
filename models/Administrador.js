import clientPromise from '../lib/mongodb.js'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

export class Administrador {
  constructor(data) {
    this.username = data.username
    this.password_hash = data.password_hash
    this.role = 'admin'
    this.created_at = new Date()
    this.updated_at = new Date()
  }

  static async getCollection() {
    const client = await clientPromise
    const db = client.db('profesores')
    return db.collection('administradores')
  }

  async save() {
    const collection = await Administrador.getCollection()
    const result = await collection.insertOne(this)
    return result
  }

  static async findByUsername(username) {
    const collection = await Administrador.getCollection()
    return await collection.findOne({ username: username })
  }

  static async findById(id) {
    const collection = await Administrador.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  static async findAll() {
    const collection = await Administrador.getCollection()
    return await collection.find({}).toArray()
  }

  static async updateByUsername(username, updateData) {
    const collection = await Administrador.getCollection()
    updateData.updated_at = new Date()
    return await collection.updateOne(
      { username: username },
      { $set: updateData }
    )
  }

  static async deleteByUsername(username) {
    const collection = await Administrador.getCollection()
    return await collection.deleteOne({ username: username })
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 12)
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }

  static async createDefaultAdmin() {
    const existingAdmin = await Administrador.findByUsername('admin')
    if (!existingAdmin) {
      const hashedPassword = await Administrador.hashPassword('admin123')
      const admin = new Administrador({
        username: 'admin',
        password_hash: hashedPassword
      })
      return await admin.save()
    }
    return null
  }
}

