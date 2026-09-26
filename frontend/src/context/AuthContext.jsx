import { createContext, useContext, useState, useEffect } from 'react';
import { getValidatedUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateSession = async () => {
            const stored = localStorage.getItem('user');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    // SECURITY: Validate user against the database to prevent localStorage tampering
                    const res = await getValidatedUser(parsed.id);
                    const validated = res?.data;
                    if (validated) {
                        // Use the role from the DATABASE, not from localStorage
                        const safeData = { ...parsed, role: validated.role, name: validated.name, email: validated.email };
                        localStorage.setItem('user', JSON.stringify(safeData));
                        setUser(safeData);
                    } else {
                        // User does not exist in DB — clear session
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                    }
                } catch {
                    // If validation fails (e.g. network error), still use stored data
                    try {
                        setUser(JSON.parse(stored));
                    } catch {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                    }
                }
            }
            setLoading(false);
        };
        validateSession();
    }, []);

    const loginUser = (userData) => {
        // Store user data (without token) in localStorage
        const { token, ...userWithoutToken } = userData;
        localStorage.setItem('user', JSON.stringify(userWithoutToken));
        // Token is stored separately by api.js login function
        if (token) {
            localStorage.setItem('token', token);
        }
        setUser(userWithoutToken);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
