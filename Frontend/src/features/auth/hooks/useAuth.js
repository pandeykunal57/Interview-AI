/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";


// Custom hook that provides authentication state and actions to components.
export const useAuth = () => {

    // Access the shared authentication state from AuthContext.
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    // Handles user login and updates the global user state after success.
    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            // Call the login API; the backend sets the authentication cookie.
            const data = await login({ email, password })
            setUser(data.user)
        } catch (err) {

        } finally {
            // Stop the loading state whether the request succeeds or fails.
            setLoading(false)
        }
    }


    // Handles user registration and stores the newly created user in context.
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            // Register the user; the backend also creates the authentication cookie.
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }


    // Logs out the current user and clears the user from global state.
    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()

            // Remove the user from React state after successful logout.
            setUser(null)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {

        // Checks whether a valid authenticated session already exists.
        const getAndSetUser = async () => {
            try {

                // The backend identifies the user using the authentication cookie.
                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                // Initial authentication check is complete.
                setLoading(false)
            }
        }

        // Run the authentication check when the app first mounts.
        getAndSetUser()

    }, [])

    // Expose authentication state and handlers to components using this hook.
    return { user, loading, handleRegister, handleLogin, handleLogout }
}