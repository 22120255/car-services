import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from "./config.js";

const provider = new GoogleAuthProvider();

provider.addScope('profile');

// auth.languageCode = 'it';
auth.useDeviceLanguage();
provider.setCustomParameters({
    'login_hint': 'user@example.com'
});

async function signInWithGoogle() {
    try {
        if (auth.currentUser) {
            await signOut(auth);
        }

        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        return user;
    } catch (error) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.customData.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
        throw error;
    }
}

export { signInWithGoogle };


