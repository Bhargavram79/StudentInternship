import { createContext, useContext, useState, useEffect } from 'react';
import { getValidatedUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // SECURITY: Validate user against the database to prevent localStorage tampering
                const validated = getValidatedUser(parsed.id);
                if (validated) {
                    // Use the role from the DATABASE, not from localStorage
                    const safeData = { ...parsed, role: validated.role, name: validated.name, email: validated.email };
                    localStorage.setItem('user', JSON.stringify(safeData));
                    setUser(safeData);
                } else {
                    // User does not exist in DB — clear session
                    localStorage.removeItem('user');
                }
            } catch {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const loginUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

