import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    async function login(credentials) {
        try {
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao fazer login');
            }
    
            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            navigate('/dashboard');  // Redireciona para o dashboard ou outra página após o login
        } catch (error) {
            throw new Error(error.message || 'Erro ao fazer login');
        }
    }
    

    function logout() {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    }

    const value = {
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
