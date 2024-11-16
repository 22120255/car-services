import { signOut, signInWithPopup, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from "./config.js";

const provider = new FacebookAuthProvider();


// auth.languageCode = 'it';
auth.useDeviceLanguage();

provider.setCustomParameters({
    'display': 'popup'
});

async function signInWithFacebook() {
    try {
        if (auth.currentUser) {
            await signOut(auth);
        }

        const result = await signInWithPopup(auth, provider);
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        return user;
    } catch (error) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.customData.email;
        // const credential = FacebookAuthProvider.credentialFromError(error);
        throw error;
    }
}
export { signInWithFacebook };