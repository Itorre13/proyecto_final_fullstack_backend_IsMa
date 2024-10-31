import dotenv from 'dotenv';
import postgres from 'postgres';
dotenv.config(); // Carga las variables de entorno del fichero .env

function conectar(){ // Función para crear la conexión con las variables de entorno del fichero .env
    return postgres({ 
            host : process.env.DB_HOST,
            database : process.env.DB_NAME,
            user : process.env.DB_USER,
            password : process.env.DB_PASSWORD
    });
}

export function leerParticipantes(){ // Función leerParticipante que primero conecta, después lee los Participantes de la base de datos y si ha salido bien los envía y si no muestra un mesanje de error
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

export function nuevoParticipante({nombre,apellidos,email,telefono,perro,raza,carrera}){ // Función nuevoParticipante que primero conecta, después crea el nuevo Participantes con los datos introducidos en la base de datos y si ha salido bien envía el id de ese nuevo Participante y si no muestra un mensaje de error
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

export function borrarParticipante(id){ // Función borrarParticipante que primero conecta, después borra el Participante de la base de datos con la id introducida y si ha salido bien envía un 1 y si no, será un 0 y muestra un mensaje de error
    return new Promise(async (ok,ko) => {
        const conexion = conectar();
        try{
            let {count} = await conexion`DELETE FROM participantes WHERE id = ${id}`;

            conexion.end();

            ok(count);

        }catch(error){
            ko({ error : "error en base de datos" });
        }
    });
}


export function actualizarParticipante(id,nombre,apellidos,email,telefono,perro,raza,carrera){ // Función actualizarParticipante que primero conecta, después actualiza el Participante en la base de datos con los datos introducidos y si ha salido bien envía un 1 y si no, será un 0 y muestra un mensaje de error
    return new Promise(async (ok,ko) => {
        const conexion = conectar();
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

            ok(count);

        }catch(error){
           ko({ error : "error en base de datos" });
        }
    });
}



