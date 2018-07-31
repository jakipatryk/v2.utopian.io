// Contributions Store - Actions.

// imports.
import firebase from 'firebase/app'
import { githubClient, makeSearchOptions, mapGithubResults } from 'src/services/github'
// lodash helpers.
import { toString, first } from 'lodash-es'

export const loadDrafts = ({ commit, getters, dispatch, rootGetters }) => {
  // console.log(rootGetters)
}

/**
 * Github repository search.
 *
 * @TODO remove to a common / github only store.
 *
 * @param store
 * @param query
 *
 * @return {Promise<T | Array>}
 */
export const searchGithubRepository = (store, query) => {
  return githubClient.search
    .repos(makeSearchOptions(query))
    .then(mapGithubResults)
    .catch(() => ([]))
}

/**
 * Get contribution by author and permlink.
 *
 * @param store
 * @param author
 * @param permlink
 *
 * @return {Promise<firebase.firestore.QuerySnapshot>}
 */
export const getContribution = (store, { author, permlink }) => {
  // alias db.
  const db = firebase.firestore()

  // get contribution from database using author and permlink.
  return db.collection('contributions')
    .where('author', '==', toString(author).replace('@', ''))
    .where('permlink', '==', permlink)
    .get()
    .then(snapshot => first(snapshot.docs))
    .then(doc => doc ? doc.data() : null)
}

/**
 * Save contributions on database.
 *
 * @param store
 * @param data
 *
 * @return {Promise<firebase.functions.HttpsCallableResult>}
 */
export const saveContribution = (store, data) => {
  // alias the api credentials to token callable method.
  const callSave = firebase.functions().httpsCallable('api/contributions/create')
  // call the api to validate the Github token.
  return callSave({ contribution: data })
}
