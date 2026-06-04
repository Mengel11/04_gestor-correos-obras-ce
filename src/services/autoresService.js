import { 
    collection, 
    addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc,
    serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const registrarAutor = async (autor) => {
    const nuevoAutor = {
        ...autor,
        fechaAlta: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, "autores"), nuevoAutor);
    console.log("Éxito. ID generado por Firebase: ", docRef.id);
    return docRef.id;
};

export const obtenerAutores = async () => {
    const querySnapshot = await getDocs(collection(db, "autores"));
    const autores = querySnapshot.docs.map( doc => ({ id: doc.id, ...doc.data() }));
    return autores;
};

export const eliminarAutor = async (id) => {
    await deleteDoc(doc(db, "autores", id));
    console.log("Autor eliminado exitosamente")
};

export const actualizarAutor = async (id, autorActualizado) => {
    const autorRef = doc(db, "autores", id);
    await updateDoc(autorRef, autorActualizado);
    console.log("Autor actualizado exitosamente");
}

export const obtenerAutor = async (id) => {
    const autorDoc = await getDoc(doc(db, "autores", id));
    const autor = { id: autorDoc.id, ...autorDoc.data() };
    return autor;
}