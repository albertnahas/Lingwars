import firebase from '../config';

export interface Challenge {
    id?: string;
    uid?: string;
    level?: number;
    seed?: number;
    status?: number;
    createdAt?: firebase.firestore.Timestamp
    finishedAt?: firebase.firestore.Timestamp
    scores?: object
    players?: object
}