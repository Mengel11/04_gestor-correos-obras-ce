import {
    collection,
    addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const COLECCION_MIEMBROS_CE = "miembrosCE";

export const registrarMiembroCE = async (miembroCE) => {
    const nuevoMiembroCE = {
        ...miembroCE,
        fechaAlta: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, COLECCION_MIEMBROS_CE), nuevoMiembroCE);
    console.log("Éxito. ID generado por Firebase: ", docRef.id);
    return docRef.id;
};

export const obtenerMiembrosCE = async () => {
    const querySnapshot = await getDocs(collection(db, COLECCION_MIEMBROS_CE));
    const miembrosCE = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return miembrosCE;
};

export const eliminarMiembroCE = async (id) => {
    await deleteDoc(doc(db, COLECCION_MIEMBROS_CE, id));
    console.log("Miembro CE eliminado exitosamente")
};

export const actualizarMiembroCE = async (id, miembroCEActualizado) => {
    const miembroCERef = doc(db, COLECCION_MIEMBROS_CE, id);
    await updateDoc(miembroCERef, miembroCEActualizado);
    console.log("Miembro CE actualizado exitosamente");
}

export const obtenerMiembroCE = async (id) => {
    const miembroCEDoc = await getDoc(doc(db, COLECCION_MIEMBROS_CE, id));
    const miembroCE = { id: miembroCEDoc.id, ...miembroCEDoc.data() };
    return miembroCE;
}
