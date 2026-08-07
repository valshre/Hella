import bcrypt from 'bcrypt';

async function crearHash() {
    const passwordEnTextoPlano = 'password123';
    const saltRounds = 10;
    const hash = await bcrypt.hash(passwordEnTextoPlano, saltRounds);
    
    console.log("Copia este Hash e insértalo en tu base de datos:");
    console.log(hash);
}

crearHash();