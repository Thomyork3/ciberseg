import clientPromise from '../lib/mongodb.js'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

export class Profesor {
  constructor(data) {
    this.nombre_completo = data.nombre_completo
    this.genero = data.genero
    this.rfc = data.rfc
    this.curp = data.curp
    this.categoria = data.categoria
    this.grado_academico = data.grado_academico
    this.antig_carrera = data.antig_carrera
    this.antig_unam = data.antig_unam
    this.correo = data.correo
    this.tel_casa = data.tel_casa
    this.celular = data.celular
    this.direccion = data.direccion
    // Campos de autenticación
    this.username = data.username
    this.password_hash = data.password_hash
    this.role = 'profesor'
    this.created_at = new Date()
    this.updated_at = new Date()
  }

  static async getCollection() {
    const client = await clientPromise
    const db = client.db('profesores')
    return db.collection('profesores')
  }

  async save() {
    const collection = await Profesor.getCollection()
    const result = await collection.insertOne(this)
    return result
  }

  static async findById(id) {
    const collection = await Profesor.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  static async findAll() {
    const collection = await Profesor.getCollection()
    return await collection.find({}).toArray()
  }

  static async updateById(id, updateData) {
    const collection = await Profesor.getCollection()
    updateData.updated_at = new Date()
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
  }

  static async deleteById(id) {
    const collection = await Profesor.getCollection()
    return await collection.deleteOne({ _id: new ObjectId(id) })
  }

  static async findByEmail(email) {
    const collection = await Profesor.getCollection()
    return await collection.findOne({ correo: email })
  }

  static async findByRFC(rfc) {
    const collection = await Profesor.getCollection()
    return await collection.findOne({ rfc: rfc })
  }

  static async findByCURP(curp) {
    const collection = await Profesor.getCollection()
    return await collection.findOne({ curp: curp })
  }

  // Métodos de autenticación
  static async findByUsername(username) {
    const collection = await Profesor.getCollection()
    return await collection.findOne({ username: username })
  }

  static async updateByUsername(username, updateData) {
    const collection = await Profesor.getCollection()
    updateData.updated_at = new Date()
    return await collection.updateOne(
      { username: username },
      { $set: updateData }
    )
  }

  static async deleteByUsername(username) {
    const collection = await Profesor.getCollection()
    return await collection.deleteOne({ username: username })
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 12)
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }
}

