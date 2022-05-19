/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { attachCustomCommands } from 'cypress-firebase';

const fbConfig = {
    apiKey: "AIzaSyBtVXwmmTFsT6ohl06zew8k-6c_8CmV7Zg",
    authDomain: "lingwars-2ee8b.firebaseapp.com",
    projectId: "lingwars-2ee8b",
    storageBucket: "lingwars-2ee8b.appspot.com",
    messagingSenderId: "1032612550540",
    appId: "1:1032612550540:web:a07dc1a13b9f239f6d28a9",
    measurementId: "G-8MDJN04EXZ"
}

// Emulate RTDB if Env variable is passed
// const rtdbEmulatorHost = Cypress.env('FIREBASE_DATABASE_EMULATOR_HOST')
// if (rtdbEmulatorHost) {
//     fbConfig.databaseURL = `http://${rtdbEmulatorHost}?ns=redux-firebasev3`
// }

firebase.initializeApp(fbConfig);

// // Emulate Firestore if Env variable is passed
// const firestoreEmulatorHost = Cypress.env('FIRESTORE_EMULATOR_HOST')
// if (firestoreEmulatorHost) {
//     firebase.firestore().settings({
//         host: firestoreEmulatorHost,
//         ssl: false
//     })
// }

// const authEmulatorHost = Cypress.env('FIREBASE_AUTH_EMULATOR_HOST')
// if (authEmulatorHost) {
//     firebase.auth().useEmulator(`http://${authEmulatorHost}/`);
//     console.debug(`Using Auth emulator: http://${authEmulatorHost}/`);
// }

attachCustomCommands({ Cypress, cy, firebase })