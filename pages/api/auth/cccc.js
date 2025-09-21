// list-collections.js
import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI;

async function listCollections() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB");

    // 👇 Usar la base correcta
    const db = client.db("profesores");

    // Obtener todas las colecciones
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log("⚠️ No hay colecciones en la base de datos 'profesores'.");
    } else {
      console.log("📂 Colecciones en 'profesores':");
      collections.forEach((col) => console.log(`- ${col.name}`));
    }

  } catch (err) {
    console.error("❌ Error al listar colecciones:", err);
  } finally {
    await client.close();
    console.log("🔌 Conexión cerrada");
  }
}

listCollections();
