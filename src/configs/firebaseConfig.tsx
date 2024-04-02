import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

const firebaseConfigAuthDemoApp = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


const FirebaseStorageAuthDemoApp = initializeApp(firebaseConfigAuthDemoApp);

export default FirebaseStorageAuthDemoApp
export const imageDb = getStorage(FirebaseStorageAuthDemoApp)

export const getImageDownloadURL = async (fileWithPath: string) => {
    try {
        const storageRef = ref(imageDb, fileWithPath);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        // console.log('Error getting download URL :', error);
        return null;
    }
};