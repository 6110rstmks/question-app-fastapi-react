import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css"; // CSS モジュールをインポート

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const navigate = useNavigate()
    const { setIsAuth } = useAuth();

    // // 既にログインしている場合は、ホーム画面にリダイレクト
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8000/auth/me", {
                    method: "GET",
                    credentials: "include", // ← セッションCookieを送るために必要
                });
    
                if (response.ok) {
                    console.log("既にログインしているためホームへリダイレクト");
                    setIsAuth(true); // Context を更新
                    navigate("/categories/home");
                } else {
                    console.log("未認証（ログイン画面に留まる）");
                }
            } catch (err) {
                console.error("認証確認エラー:", err);
            }
        };
    
        checkAuth();
    }, [navigate, setIsAuth]);
    

    // googleAuthでログイン
    // const handleLoginInWithGoogle = (): void => {
    //     signInWithPopup(auth, provider).then((result) => {
    //         localStorage.setItem("isAuth", "true")
    //         navigate("/categories/home")
    //     })
    // }

    // ユーザネームとパスワードでログイン
    const handleLogin = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        setError('')

        const response = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        })

        const data = await response.json()

        console.log(response.ok)

        if (!response.ok) {
            setError(data.detail);
            return
        }

        if (response.ok) {
            console.log("ログイン成功:", data);
        }

        console.log(9827298)
        setIsAuth(true);

        navigate("/categories/home")
    }

    return (
        <div>
            <Link to="/signup">
                SignIn
            </Link> 
            <p>ログインして始める</p>
            {/* <button onClick={handleLoginInWithGoogle}>Google でログイン（開発中は使用しないで。後でまた実装する。）</button> */}

            <hr />
            <form onSubmit={handleLogin}>
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
            <p className={styles.errMsg}>{error}</p>
        </div>
    );
};

export default Login
