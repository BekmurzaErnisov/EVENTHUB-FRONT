// import {Link} from "react-router-dom"
import { NavLink } from "react-router-dom"

function Header() {
    const getLinkClass = ({isActive}: {isActive: boolean}) =>{
        return isActive ? "nav-link active" : "nav-link"
    }

    return (
    <header>
        <nav>
            <NavLink to="/" end className={getLinkClass}>Главная</NavLink>
            <NavLink to="/login" className={getLinkClass}>Вход</NavLink>
            <NavLink to="/register" className={getLinkClass}>Регистрация</NavLink>
            <NavLink to="/my-events" className={getLinkClass}>Мои события</NavLink>
            <NavLink to="/create-event" className={getLinkClass}>Создать событие</NavLink>
        </nav>
    </header>   
 )
}

export default Header