/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();

// exports.addUserToList = functions.auth.user().onCreate(async (user) => {
//   const userListRef = admin.database().ref("userList");

//   // Add user details to the list
//   await userListRef.child(user.uid).set({
//     displayName: user.displayName,
//     email: user.email,
//     phoneNumber: user.phoneNumber,
//     // Add other user details as needed
//   });
// });
