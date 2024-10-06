const { Link, NavLink } = ReactRouterDOM

export function AppHeader() {

    return <header className="app-header">
        <Link to="/">
            <h3>Google Apps</h3>
        </Link>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/mail">GMail</NavLink>
            <NavLink to="/note">Keep</NavLink>
        </nav>
    </header>
}
