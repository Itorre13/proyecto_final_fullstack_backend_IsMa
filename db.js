import dotenv from 'dotenv';
import postgres from 'postgres';
dotenv.config();

function conectar(){
    return postgres({
            host : process.env.DB_HOST,
            database : process.env.DB_NAME,
            user : process.env.DB_USER,
            password : process.env.DB_PASSWORD
    });
}

export function leerParticipantes(){
    return new Promise(async (ok,ko) => {
        const conexion = conectar();
        try{
            let participantes = await conexion`SELECT * FROM participantes`;

            conexion.end();

            ok(participantes);

        }catch(error){
            ko({ error : "error en base de datos" });
        }
    });
}

export function nuevoParticipante({nombre,apellidos,email,telefono,perro,raza,carrera}){
    return new Promise(async (ok,ko) => {
        const conexion = conectar();
        try{
            let [{id}] = await conexion`INSERT INTO participantes (nombre,apellidos,email,telefono,perro,raza,carrera) VALUES (${nombre},${apellidos},${email},${telefono},${perro},${raza},${carrera}) RETURNING id`;

            conexion.end();

            ok(id);

        }catch(error){
            ko({ error : "error en base de datos" });
        }
    });
}

export function borrarParticipante(id){
    return new Promise(async (ok,ko) => { // retorna una promesa
        const conexion = conectar(); // invoca la función conectar para traer la conexión
        try{
            let {count} = await conexion`DELETE FROM participantes WHERE id = ${id}`;

            conexion.end();

            ok(count); // será un 0 o un 1

        }catch(error){
            ko({ error : "error en base de datos" });
        }
    });
}


export function actualizarParticipante(id,nombre,apellidos,email,telefono,perro,raza,carrera){
    return new Promise(async (ok,ko) => { // retorna una promesa
        const conexion = conectar(); // invoca la función conectar para traer la conexión
        try{
            let {count} = await conexion`UPDATE participantes SET 
                    nombre = ${nombre},
                    apellidos = ${apellidos},
                    email = ${email},
                    telefono = ${telefono},
                    perro= ${perro},
                    raza= ${raza},
                    carrera = ${carrera}
                WHERE id = ${id}`;

            conexion.end();

            ok(count); // será un 0 o un 1

        }catch(error){
           ko({ error : "error en base de datos" });
        }
    });
}



