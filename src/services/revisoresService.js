import { 
    collection, 
    addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc,
    serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const registrarRevisor = async (revisor) => {
    const nuevoRevisor = {
        ...revisor,
        fechaAlta: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, "revisores"), nuevoRevisor);
    console.log("Éxito. ID generado por Firebase: ", docRef.id);
    return docRef.id;
};

export const obtenerRevisores = async () => {
    const querySnapshot = await getDocs(collection(db, "revisores"));
    const revisores = querySnapshot.docs.map( doc => ({ id: doc.id, ...doc.data() }));
    return revisores;
};

export const eliminarRevisor = async (id) => {
    await deleteDoc(doc(db, "revisores", id));
    console.log("Revisor eliminado exitosamente")
};

export const actualizarRevisor = async (id, revisorActualizado) => {
    const revisorRef = doc(db, "revisores", id);
    await updateDoc(revisorRef, revisorActualizado);
    console.log("Revisor actualizado exitosamente");
}

export const obtenerRevisor = async (id) => {
    const revisorDoc = await getDoc(doc(db, "revisores", id));
    const revisor = { id: revisorDoc.id, ...revisorDoc.data() };
    return revisor;
}