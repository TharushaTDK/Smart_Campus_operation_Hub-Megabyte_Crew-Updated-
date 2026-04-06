import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/auth/me', { withCredentials: true })
            .then(r => { setUser(r.data); setLoading(false); })
            .catch(() => { setLoading(false); navigate('/login'); });
    }, [navigate]);

    const handleLogout = () => {
        axios.post('/logout', {}, { withCredentials: true })
            .finally(() => navigate('/login'));
    };

    if (loading) return (
        <div className={styles.center}>
            <div className={styles.spinner} />
        </div>
    );

    if (!user) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <img src={user.photo} alt={user.name} className={styles.avatar} referrerPolicy="no-referrer" />
                <div className={styles.info}>
                    <h2 className={styles.name}>{user.name}</h2>
                    <p className={styles.email}>{user.email}</p>
                    <span className={styles.badge}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        Signed in with Google
                    </span>
                </div>
                <button className={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
            </div>
        </div>
    );
}
