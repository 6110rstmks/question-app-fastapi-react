import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
    isAuth: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuth }) => {
    return (
        <nav>
            <Link to="/">
                <FontAwesomeIcon icon={faHouse} />
                HOME
            </Link>
            {!isAuth ? (
                <Link to="/login">
                    <FontAwesomeIcon icon={faArrowRightToBracket} />
                    SignIn
                </Link>
            ) : (
                <>
                    <Link to="/logout">
                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                        SignOut
                    </Link>
                    <Link to="/setquestion">Set Problem</Link>
                    <Link to="/setquestion">Data Import</Link>
                    <Link to="/setquestion">Data Export</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
