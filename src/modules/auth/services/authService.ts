// src/modules/auth/services/authService.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../services/firebase/firebaseConfig";

const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
};

const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
};

const logout = async () => {
    await signOut(auth);
};

export const authService = {
    login,
    signup,
    logout,
};
