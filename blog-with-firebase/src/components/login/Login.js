import React from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, provider} from "../../firebase"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Login = ({ setIsAuth }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const loginInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            localStorage.setItem("isAuth", true)
            setIsAuth(true)
            navigate("/")
        })
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        // setError('');
    
        try {
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
            navigate("/")
        
        } catch (err) {
        //   setError('Incorrect username or password');
        }
      };

    return (
        <div>
            <p>ログインして始める</p>
            <button onClick={loginInWithGoogle}>Google でログイン</button>

            <hr></hr>
            <form onSubmit={handleLogin}>
                <label>username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />                
                <button type="submit">Sign in </button>
            </form>
        </div>
    )
}

export default Login