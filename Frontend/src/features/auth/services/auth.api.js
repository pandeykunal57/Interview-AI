/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import axios from "axios"


// Create a reusable Axios instance with common API configuration.
const api = axios.create({
    baseURL: "http://localhost:3000",

    // Allows the browser to send and receive cookies with cross-origin requests.
    withCredentials: true
})


export async function register({ username, email, password }) {

    try {
        // Send registration data to the backend authentication endpoint.
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        // Axios stores the server response body inside response.data.
        return response.data

    } catch (err) {

        console.log(err)

    }

}


export async function login({ email, password }) {

    try {

        // Send login credentials to the backend.
        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.log(err)
    }

}


export async function logout() {
    try {

        // Request logout; the browser sends the existing authentication cookie.
        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {

    }
}


export async function getMe() {

    try {

        // The authentication cookie identifies the currently logged-in user.
        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.log(err)
    }

}