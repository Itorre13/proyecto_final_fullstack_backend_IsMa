import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { leerParticipantes,nuevoParticipante,borrarParticipante,actualizarParticipante } from './db.js';


dotenv.config(); // Carga las variables de entorno del fichero .env

const servidor = express() // Crea servidor con express

/* MIDDLEWARES */

servidor.use(cors()); // Permite hacer peticiones desde cualquier dominio
servidor.use(express.json()); // Intercepta cualquier información que le llega con urlencoded content-type : application/json y lo convierte a objeto y lo almacena en petición.body

servidor.get("/participantes", async (peticion,respuesta) => { // Si llega una petición con el metodo GET este es el callback que se encarga de responder
    try{
        let participantes = await leerParticipantes(); // Lee los Participantes de la base de datos

        respuesta.json(participantes) // Envía los Participantes como json
    }catch(error){
        respuesta.status(500); // Algo salió mal, error en el servidor
        respuesta.json({ error : "error en el servidor" }); // Mensaje error en el servidor
    }
});

servidor.post("/participantes/nuevo", async (peticion,respuesta) => { // Si llega una petición con el metodo POST a esta URL este es el callback que se encarga de responder
    try{
        let id = await nuevoParticipante(peticion.body); // Añade un nuevo Participante cogiendo el body de la petición y cogemos el id

        respuesta.status(201); // Respuesta de todo salió ok y se ha creado un registro
        return respuesta.json({id}) // Responde con el id de ese nuevo registro

    }catch(error){
        respuesta.status(500); // Algo salió mal, error en el servidor
        respuesta.json({ error : "error en el servidor" }); // Mensaje error en el servidor
    }
});

servidor.put("/participantes/actualizar/participante/:id([0-9]+)", async (peticion,respuesta,siguiente) => { // Si llega una petición con el metodo PUT a esta URL este es el callback que se encarga de responder
    
    let {id} = peticion.params; // Extrae el id de los parámetros de la petición
    let { nombre,apellidos,email,telefono,perro,raza,carrera } = peticion.body; // Extrae nombre,apellidos,email,telefono,perro,raza y carrera del cuerpo de la petición

    if(nombre.trim() == "" && apellidos.trim() == "" && email.trim() == "" && telefono.trim() == "" && perro.trim() == "" && raza.trim() == "" && carrera.trim() == ""){ // Si los datos introducidos sin espacios y son iguales de vacío haremos lo siguiente
        return siguiente({ error : "error en los datos actualizados"}) // Retorna siguiente con el error
    }
    try{
        let cantidad = await actualizarParticipante(id,nombre,apellidos,email,telefono,perro,raza,carrera); // Si todos los datos son correctos acualiza el Participante

        respuesta.json( { resultado : cantidad ? "ok" : "ko" }); // Respuesta si el resultado es cantidad "ok" y si no "ko"

    }catch(error){
        respuesta.status(500); // Algo salió mal, error en el servidor
        respuesta.json({ error : "error en el servidor" }); // Mensaje error en el servidor
    }
});

servidor.delete("/participantes/borrar/:id([0-9]+)", async (peticion,respuesta) => { // Si llega una petición con el metodo DELETE a esta URL este es el callback que se encarga de responder
    try{
        let cantidad = await borrarParticipante(peticion.params.id); // Borra el Participante con el id de los parámetros de la petición

        respuesta.json( { resultado : cantidad ? "ok" : "ko" }); // Respuesta si el resultado es cantidad "ok" y si no "ko"

    }catch(error){
        respuesta.status(500); // Algo salió mal, error en el servidor
        respuesta.json({ error : "error en el servidor" }); // Mensaje error en el servidor
    }
});

servidor.use((error,peticion,respuesta,siguiente) => { // Necesita los cuatro a pesar de que vayamos a utilizar solo el error y la respuesta. Los necesita porque sino el no puede identificar que necesita cuatro 'cosas' y no pasaría a la siguiente
    respuesta.status(400); // Algo salió mal, solicitud incorrecta
    respuesta.json({ error : "error en la petición" }); // Mensaje error en la petición
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404); // Algo salió mal, recurso no encontrado
    respuesta.json({ error : "recurso no encontrado" }); // Mensaje recurso no encontrado
});

servidor.listen(process.env.PORT); // Escucha las peticiones en el puerto indicado en el fichero .env

