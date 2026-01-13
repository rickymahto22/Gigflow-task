import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { socket } from '../socket';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await axios.get('/api/auth/me');
                setUser(data);
                if (data) {
                    socket.connect();
                    socket.emit('join', data._id);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();

        // Listen for notifications globally
        socket.on('notification', (data) => {
            alert(data.message); // Simple alert for now, could be Toast
        });

        return () => {
            socket.off('notification');
        };
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data);
        socket.connect();
        socket.emit('join', data._id);
    };

    const register = async (name, email, password, role) => {
        const { data } = await axios.post('/api/auth/register', { name, email, password, role });
        setUser(data);
        socket.connect();
        socket.emit('join', data._id);
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        setUser(null);
        socket.disconnect();
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
