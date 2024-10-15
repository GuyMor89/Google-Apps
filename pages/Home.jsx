const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function Home() {

    const navigate = useNavigate()

    return <section className="home">
        <div className="page-overlay">
            <div className="page-header">AppSus</div>
            <div className="custom-search">
                <div className="gcse-search"></div>
            </div>
            <div className="app-container">
                <div id="gmail-icon" onClick={() => navigate('/mail')}>
                    <img src="./assets/img/icon.png"></img>
                </div>
                <div id="books-icon" onClick={() => navigate('')}>
                    <img src="./assets/img/books.png"></img>
                </div>
                <div id="youtube-icon" onClick={() => navigate('/wikitube')}>
                    <img src="./assets/img/youtube.png"></img>
                </div>
            </div>
        </div>
        <footer>
            <div></div>
            <div>
                <div>
                    <span>Copyright</span>
                    <span><i className="fa-regular fa-copyright"></i></span>
                </div>
                <span>2024</span>
                <span data-i18n="footerBy">by Guy Mor</span>
            </div>
            <a></a>
        </footer>
    </section>
}