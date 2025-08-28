import React from "react";
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import styles from "./Navbar.module.css";
import { useNavbar } from "./useNavbar";

const Navbar: React.FC = () => {
    const { handleJsonExport, handleCSVExport } = useNavbar();


    return (
        <nav>
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
        </nav>
    );
};

export default Navbar;
