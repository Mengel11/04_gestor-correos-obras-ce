import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const registrarAutor = async (autor) => {
    const nuevoAutor = {
        ...autor,
        fecha_registro: new Date().toISOString()
    };

    try {
        const docRef = await addDoc(collection(db, "autores"), nuevoAutor);
        console.log("Éxito. ID generado por Firebase: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al registrar autor en Firebase: ", error);
        throw error; // Lanzamos el error para que la página muestre una alerta
    }
};