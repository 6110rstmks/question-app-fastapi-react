import React, { useEffect, useState } from "react";
import { Link } from "react-router"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import styles from "./Navbar.module.css";
import { useNavbar } from "./useNavbar";
import { useAuth } from "../context/AuthContext"


const Navbar: React.FC = () => {
    // const [isAuth, setIsAuth] = useState<boolean>(false);
    const { handleJsonExport, handleCSVExport } = useNavbar();

    const { isAuth, setIsAuth } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8000/auth/me", {
                    method: "GET",
                    credentials: "include",
                });

                console.log(response)

                if (response.ok) {
                    console.log("認証確認成功");
                    setIsAuth(true);
                } else {
                    console.log("認証確認失敗");
                    setIsAuth(false);
                }
            } catch (error) {
                console.error("認証確認エラー:", error);
                setIsAuth(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <nav>
            {!isAuth ? (
                <>
                    <Link to="/" className={styles.clickable}>
                        <FontAwesomeIcon icon={faHouse} />
                        HOME
                    </Link>
                    <Link to="/login" className={styles.clickable}>
                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                        SignIn
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/categories/home" className={styles.clickable}>
                        <FontAwesomeIcon icon={faHouse} />
                        HOME
                    </Link>
                    <Link to="/logout" className={styles.clickable}>
                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                        SignOut
                    </Link>
                    <Link to="/set_question" className={styles.clickable}>Set Problem</Link>
                    <Link to="/import" className={styles.clickable}>
                        Data Import
                        <div className={styles.tooltip}>システム特有のjsonファイルをインポートすることでデータの引き継ぎができます。</div>
                    </Link>
                    <div className={styles.clickable}>
                        Data Export to Local & Github
                        <div className={styles.tooltip} onClick={handleJsonExport}>JSONでexport</div>
                        <div className={styles.tooltip2} onClick={handleCSVExport}>CSVでexport</div>
                    </div>
                    <Link to="/report_page">回答レポートを表示</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
