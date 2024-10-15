const { Link, NavLink } = ReactRouterDOM

export function AppHeader() {

    return <header className="app-header">
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/mail">GMail</NavLink>
            <NavLink to="/books">Books</NavLink>
            <NavLink to="/wikitube">WikiTube</NavLink>
        </nav>
    </header>
}
