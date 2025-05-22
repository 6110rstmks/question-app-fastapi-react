import { signInWithPopup, signOut } from "firebase/auth"
import { auth, provider} from "../../firebase"
import { useNavigate } from "react-router"

interface LogoutProps {
    setIsAuth: (value: boolean) => void
}

const Logout: React.FC<LogoutProps> = ({ setIsAuth }) => {
    const navigate = useNavigate()
    const logout = () => {
        signOut(auth).then((result) => {
            localStorage.clear()
            setIsAuth(false)
            navigate("/login")
        })
    }
    return (
        <div>
            <p>ログアウトする</p>
            <button onClick={logout}>Google でログアウト</button>
        </div>
    )
}

export default Logout