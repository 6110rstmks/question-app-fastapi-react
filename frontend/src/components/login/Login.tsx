import React, { useState, FormEvent, ChangeEvent } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";

interface LoginProps {
    setIsAuth: (isAuth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuth }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const loginInWithGoogle = (): void => {
        signInWithPopup(auth, provider).then((result) => {
            localStorage.setItem("isAuth", "true");
            setIsAuth(true);
            navigate("/categories/home");
        });
    };

    const handleLogin = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');

        const response = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Incorrect username or password');
        }

        const data = await response.json();
        const { access_token } = data;
        localStorage.setItem('access_token', access_token);
        navigate("/categories/home")
    }

    return (
        <div>
            <p>ログインして始める</p>
            <button onClick={loginInWithGoogle}>Google でログイン</button>

            <hr />
            <form onSubmit={handleLogin}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <button type="submit">Sign in</button>
            </form>
        </div>
    );
};

export default Login;
