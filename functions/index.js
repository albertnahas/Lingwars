const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
admin.firestore().settings({ ignoreUndefinedProperties: true })
const cors = require("cors")({ origin: true });

const seedRange = 999999

// Listens for challenge creation
exports.challengeCreated = functions.firestore
  .document("/challenges/{id}")
  .onCreate(async (snap) => {
    functions.logger.log("challenge created ...")
    snap.ref.set(
      { seed: Math.round(Math.random() * seedRange) },
      { merge: true }
    )
    return true
  })

// Listens for requests creation
exports.requestCreated = functions.runWith({
  // Ensure the function has enough memory and time
  // to process large files
  timeoutSeconds: 300,
  memory: "1GB",
}).firestore
  .document("/requests/{id}")
  .onCreate(async (snap) => {
    const requestData = snap.data()
    const size = requestData.players
    functions.logger.log("request size", size)

    if (requestData.rematchId) {
      const challengeId = requestData.rematchId
      admin
        .firestore()
        .collection("challenges")
        .doc(challengeId)
        .set(
          {
            rematchRequested: true,
          },
          { merge: true }
        )
    }

    admin
      .firestore()
      .collection("requests")
      .where("players", "==", size)
      .where("level", "==", requestData.level)
      .where("waiting", "==", true)
      .where("rematchId", "==", requestData.rematchId)
      .orderBy("createdAt", "asc")
      .limit(size)
      .get()
      .then((snapshot) => {
        functions.logger.log("checking for request ...", snap.id, "and found", snapshot.size)
        if (snapshot.size >= size) {
          delete requestData.waiting
          delete requestData.rematchRequested
          delete requestData.id
          delete requestData.uid

          const requestsDocs = snapshot.docs.slice(0, size);
          const cId = requestsDocs[0].id
          admin
            .firestore()
            .collection("challenges")
            .doc(cId)
            .set(
              Object.assign({}, requestData, {
                status: "started",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
              })
            )
            .then(function () {
              const batch = admin.firestore().batch()
              requestsDocs.forEach((doc) => {
                batch.update(doc.ref, "challengeId", cId)
                batch.update(doc.ref, "waiting", false)
              })
              functions.logger.log("writing challenge with ...", cId)
              return batch.commit()
            })
            .catch((e) => {
              console.log(e)
            })
        }
      })

    return true
  })

// Listens for player creation
exports.playerCreated = functions.firestore
  .document("/challenges/{id}/players/{playerId}")
  .onCreate(async (snap, context) => {
    const challengeId = context.params.id
    updateChallengeStatus(challengeId)
    return true
  })

// Listens for player deletion
exports.playerRemoved = functions.firestore
  .document("/challenges/{id}/players/{playerId}")
  .onDelete(async (snap, context) => {
    const challengeId = context.params.id

    // remove all rematch requests
    admin.firestore()
      .collection("requests")
      .where("rematchId", "==", challengeId)
      .get()
      .then((snapshot) => {
        if (snapshot.size > 0) {
          const removeRequestsBatch = admin.firestore().batch()
          snapshot.docs.forEach((doc) => {
            removeRequestsBatch.delete(doc.ref)
          })
          return removeRequestsBatch.commit()
        }
      })

    const playersSnap = await admin
      .firestore()
      .collection(`challenges/${challengeId}/players`)
      .get()
    if (playersSnap.size == 0) {
      // remove challenge with 0 players
      return admin
        .firestore()
        .collection("challenges")
        .doc(challengeId)
        .delete()
    } else {
      // turn off rematch request after player left
      admin
        .firestore()
        .collection("challenges")
        .doc(challengeId)
        .set(
          {
            rematchRequested: false,
          },
          { merge: true }
        )
    }
    return true
  })

exports.checkChallengeStatus = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const challengeId = req.query.challengeId || req.body.data.challengeId;
    if (!challengeId) {
      res.status(500).send("No challenge id");
    }
    const challenge = await admin
      .firestore()
      .collection("challenges")
      .doc(challengeId)
      .get()

    if (!challenge.exists) {
      res.status(500).send("Invalid challenge id");
    }

    const rounds = challenge.data().rounds
    const unfinishedPlayersSnap = await admin
      .firestore()
      .collection(`challenges/${challengeId}/players`)
      .where("turn", "!=", rounds)
      .get()

    if (unfinishedPlayersSnap.size === 0) {
      const update = { status: "finished" }
      challenge.ref.set(update, { merge: true })
      res.json({ data: Object.assign(challenge.data(), update) });
    } else {
      res.json({ data: Object.assign(challenge.data()) });
    }
  })
})

exports.onUserStatusChanged = functions.database
  .ref("/status/{uid}")
  .onUpdate(async (change, context) => {
    // Get the data written to Realtime Database
    const eventStatus = change.after.val()
    const uid = context.params.uid
    // Then use other event data to create a reference to the
    // corresponding Firestore document.
    const userStatusFirestoreRef = admin.firestore().doc(`users/${uid}`)

    const statusSnapshot = await change.after.ref.once("value")
    const status = statusSnapshot.val()

    // Otherwise, we convert the last_changed field to a Date
    eventStatus.last_changed = new Date(eventStatus.last_changed)
    functions.logger.log(eventStatus)
    userStatusFirestoreRef.set({ status }, { merge: true }).then(() => {
      if (status === "offline") {
        const removePLayersBatch = admin.firestore().batch()
        const removeRequestsBatch = admin.firestore().batch()
        admin
          .firestore()
          .collectionGroup("players")
          .where("id", "==", uid)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              removePLayersBatch.delete(doc.ref)
            })
            return removePLayersBatch.commit()
          })
        admin
          .firestore()
          .collection("requests")
          .where("uid", "==", uid)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              removeRequestsBatch.delete(doc.ref)
            })
            return removeRequestsBatch.commit()
          })
      }
    })
  })

const updateChallengeStatus = async (challengeId) => {
  const playersSnap = await admin
    .firestore()
    .collection(`challenges/${challengeId}/players`)
    .get()
  const challengeQuery = admin
    .firestore()
    .collection("challenges")
    .doc(challengeId)
  const challenge = await challengeQuery.get()
  const players = challenge.data().players
  return admin
    .firestore()
    .collection("challenges")
    .doc(challengeId)
    .set(
      {
        activePlayers: playersSnap.size,
        full: players == playersSnap.size,
      },
      { merge: true }
    )
}
