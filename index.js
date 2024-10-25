import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { leerParticipantes,nuevoParticipante,borrarParticipante,actualizarParticipante } from './db.js';

dotenv.config();

const servidor = express()

servidor.use(cors());
servidor.use(express.json());

servidor.get("/participantes", async (peticion,respuesta) => {
    try{
        let participantes = await leerParticipantes();

        respuesta.json(participantes)
    }catch(error){
        respuesta.status(500); // algo salió mal, error en el servidor
        respuesta.json({ error : "error en el servidor" }); // mensaje error en el servidor
    }
});

servidor.post("/participantes/nuevo", async (peticion,respuesta) => {
    try{
        let id = await nuevoParticipante(peticion.body);

        respuesta.status(201); // respuesta de todo salió ok y se ha creado un registro
        return respuesta.json({id}) // respondemos con el id de ese nuevo resgistro

    }catch(error){
        respuesta.status(500); // algo salió mal, error en el servidor
        respuesta.json({ error : "error en el servidor" }); // mensaje error en el servidor
    }
});

servidor.put("/participantes/actualizar/participante/:id([0-9]+)", async (peticion,respuesta,siguiente) => {
    
    let {id} = peticion.params;
    let { nombre,apellidos,email,telefono,perro,raza,carrera } = peticion.body;

    if(nombre.trim() == ""){
        return siguiente({ error : "no tiene la propiedad nombre"})
    }
    try{
        let cantidad = await actualizarParticipante(id,nombre,apellidos,email,telefono,perro,raza,carrera);

        respuesta.json( { resultado : cantidad ? "ok" : "ko" }); // respuesta si el resultado es cantidad "ok" y si no "ko"

    }catch(error){
        respuesta.status(500); // algo salió mal, error en el servidor
        respuesta.json({ error : "error en el servidor" }); // mensaje error en el servidor
    }
});

servidor.delete("/participantes/borrar/:id([0-9]+)", async (peticion,respuesta) => {
    try{
        let cantidad = await borrarParticipante(peticion.params.id);

        respuesta.json( { resultado : cantidad ? "ok" : "ko" }); // respuesta si el resultado es cantidad "ok" y si no "ko"

    }catch(error){
        respuesta.status(500); // algo salió mal, error en el servidor
        respuesta.json({ error : "error en el servidor" }); // mensaje error en el servidor
    }
});

servidor.use((error,peticion,respuesta,siguiente) => { // necesita los cuatro a pesar de que vayamos a utilizar solo el error y la respuesta. Los necesita porque sino el no puede identificar que necesita cuatro cosas
    respuesta.status(400); // decirle a la respuesta que su status es 400
    respuesta.json({ error : "error en la petición" }); // a través de esa respueta en json responde con error en la petición
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "recurso no encontrado" });
});

servidor.listen(process.env.PORT);

