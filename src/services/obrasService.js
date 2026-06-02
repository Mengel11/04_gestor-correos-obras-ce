import { 
    collection, 
    addDoc, getDocs, deleteDoc, doc, updateDoc, 
    serverTimestamp 
} from "firebase/firestore";
import { db } from '../firebaseConfig';

export const registrarObra = async (obra) => {
    const nuevaObra = {
        ...obra,
        fechaAlta: serverTimestamp(),
        estado: 'Verificación de la clasificación',
        clasificacionApta: null,
        revisoresMinimos: null,
        fechaLimiteRevisores: null,
        revisoresAsignados: [],
        revisionesMinimas: null,
        fechaLimiteRevisiones: null,
        decisionFinal: null
    }
    await addDoc(collection(db, "obras"), nuevaObra);
};

export const obtenerObras = async () => {
    const querySnapshot = await getDocs(collection(db, "obras"));
    const obras = querySnapshot.docs.map( doc => ({ id: doc.id, ...doc.data() }));
    return obras;
};

export const eliminarObra = async (id) => {
    await deleteDoc(doc(db, "obras", id));
}

export const actualizarObra = async (id, obraActualizada) => {
    const obraRef = doc(db, "obras", id);
    await updateDoc(obraRef, obraActualizada);
}