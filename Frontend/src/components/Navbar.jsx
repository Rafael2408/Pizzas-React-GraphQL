import { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../styles/navBar.css'

function NavBar() {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState('pizzas');

    return (
        <nav className="navbar navbar-expand-lg bg-light" id="content-navbar">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Página de Pizzas</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className={`nav-link ${currentPage === 'pizzas' ? 'active' : ''}`} onClick={() => {
                                setCurrentPage('pizzas')
                                navigate('/pizza')
                                }}>Pizzas</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${currentPage === 'ingredients' ? 'active' : ''}`} onClick={() => {
                                setCurrentPage('ingredients')
                                navigate('/ingredient')
                                }}>Ingredientes</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
