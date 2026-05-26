import { 
    collection, 
    addDoc, getDocs, deleteDoc, doc, updateDoc, 
    serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const registrarAutor = async (autor) => {
    const nuevoAutor = {
        ...autor,
        fecha_registro: serverTimestamp()
    };

    try {
        const docRef = await addDoc(collection(db, "autores"), nuevoAutor);
        console.log("Éxito. ID generado por Firebase: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al registrar autor en Firebase: ", error);
        throw error; 
    }
};

export const obtenerAutores = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "autores"));
        const autores = querySnapshot.docs.map( doc => ({ id: doc.id, ...doc.data() }));
        return autores;
    } catch (error) {
        console.error("Error al obtener autores de Firebase: ", error);
        throw error;
    }
};

export const eliminarAutor = async (id) => {
  try {
    await deleteDoc(doc(db, "autores", id));
    console.log("Autor eliminado exitosamente")
  } catch (error) {
    console.error("Error al eliminar autor en Firebase: ", error);
    throw error;
  }
};

export const actualizarAutor = async (id, autorActualizado) => {
    try {
        const autorRef = doc(db, "autores", id);
        await updateDoc(autorRef, autorActualizado);
        console.log("Autor actualizado exitosamente");
    } catch (error) {
        console.error("Error al actualizar autor en Firebase: ", error);
        throw error;
    }
}