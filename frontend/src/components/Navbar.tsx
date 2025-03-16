import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import styles from "./Navbar.module.css";

interface NavbarProps {
    isAuth: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuth }) => {



    const handleJsonExport = async () => {    
        try {
            const response = await fetch("http://localhost:8000/categories/export", {
                method: "GET",
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Blobオブジェクトを作成
            const blob = await response.blob();
    
            // ダウンロードリンクを作成
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
    
            // ファイル名を設定（バックエンド側で指定した名前と一致させる）
            // link.download = "categories.csv";
            // link.download = "backup_self_made_app.zip";
            link.download = "backup_self_made_app.zip";

    
            // ダウンロードをトリガー
            document.body.appendChild(link);
            link.click();
    
            // リンクをクリーンアップ
            link.remove();
            window.URL.revokeObjectURL(url);
    
        } catch (error) {
            console.error("Error exporting file:", error);
        }
    };

    const handleCSVExport = async () => {    
        try {
            const response = await fetch("http://localhost:8000/categories/export", {
                method: "GET",
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Blobオブジェクトを作成
            const blob = await response.blob();
    
            // ダウンロードリンクを作成
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
    
            // ファイル名を設定（バックエンド側で指定した名前と一致させる）
            // link.download = "categories.csv";
            // link.download = "backup_self_made_app.zip";
            link.download = "backup_self_made_app.zip";

    
            // ダウンロードをトリガー
            document.body.appendChild(link);
            link.click();
    
            // リンクをクリーンアップ
            link.remove();
            window.URL.revokeObjectURL(url);
    
        } catch (error) {
            console.error("Error exporting file:", error);
        }
    };

    return (
        <nav>
            <Link to="/" className={styles.clickable}>
                <FontAwesomeIcon icon={faHouse} />
                HOME
            </Link>
            {!isAuth ? (
                <Link to="/login" className={styles.clickable}>
                    <FontAwesomeIcon icon={faArrowRightToBracket} />
                    SignIn
                </Link>
            ) : (
                <>
                    <Link to="/logout" className={styles.clickable}>
                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                        SignOut
                    </Link>
                    <Link to="/setquestion" className={styles.clickable}>Set Problem</Link>
                    <Link to="/import" className={styles.clickable}>
                        Data Import
                        <div className={styles.tooltip}>システム特有のjsonファイルをインポートすることでデータの引き継ぎができます。</div>
                    </Link>
                    <div className={styles.clickable} onClick={handleJsonExport}>
                        Data Export to Local & Github
                        <div className={styles.tooltip}>githubにデータを保管します。</div>
                    </div>
                    <Link to="/report_page">回答レポートを表示</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar
