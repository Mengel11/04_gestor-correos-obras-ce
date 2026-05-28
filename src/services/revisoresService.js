import { 
    collection, 
    addDoc, getDocs, deleteDoc, doc, updateDoc, 
    serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const registrarRevisor = async (revisor) => {
    const nuevoRevisor = {
        ...revisor,
        fecha_registro: serverTimestamp()
    };

    try {
        const docRef = await addDoc(collection(db, "revisores"), nuevoRevisor);
        console.log("Éxito. ID generado por Firebase: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al registrar revisor en Firebase: ", error);
        throw error; 
    }
};

export const obtenerRevisores = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "revisores"));
        const revisores = querySnapshot.docs.map( doc => ({ id: doc.id, ...doc.data() }));
        return revisores;
    } catch (error) {
        console.error("Error al obtener revisores de Firebase: ", error);
        throw error;
    }
};

export const eliminarRevisor = async (id) => {
  try {
    await deleteDoc(doc(db, "revisores", id));
    console.log("Revisor eliminado exitosamente")
  } catch (error) {
    console.error("Error al eliminar revisor en Firebase: ", error);
    throw error;
  }
};

export const actualizarRevisor = async (id, revisorActualizado) => {
    try {
        const revisorRef = doc(db, "revisores", id);
        await updateDoc(revisorRef, revisorActualizado);
        console.log("Revisor actualizado exitosamente");
    } catch (error) {
        console.error("Error al actualizar revisor en Firebase: ", error);
        throw error;
    }
}