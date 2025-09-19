
import fs from 'fs/promises';
import path from 'path';


const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
];


const envFilePath = path.resolve(process.cwd(), '.env.local');

async function createEnvFile() {
  console.log('Verificando y generando el archivo .env.local...');

  let envContent = '';
  let missingVars = [];

  for (const varName of requiredEnvVars) {
   
    const value = process.env[varName];

    if (value) {
      envContent += `${varName}=${value}\n`;
    } else {
      missingVars.push(varName);
    }
  }

  
  if (missingVars.length > 0) {
    console.error('¡Error! Faltan las siguientes variables de entorno en el servidor:');
    console.error(missingVars.join(', '));
    console.error('Por favor, configúralas antes de continuar.');
    process.exit(1); 
  }

  try {
   
    await fs.writeFile(envFilePath, envContent);
    console.log('El archivo .env.local ha sido creado exitosamente.');
  } catch (error) {
    console.error('Error al escribir el archivo .env.local:', error);
    process.exit(1);
  }
}

createEnvFile();
