import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBjokQmYwuGIr_mIlMHAYsfUBp9gn2msg0",
    authDomain: "meet-tea-943c2.firebaseapp.com",
    projectId: "meet-tea-943c2",
    storageBucket: "meet-tea-943c2.appspot.com",
    messagingSenderId: "148191786592",
    appId: "1:148191786592:web:ca65c3120f02cc4ceab505"
};

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const storage = app.storage();
const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { db, storage, auth, provider, firebase as default };
