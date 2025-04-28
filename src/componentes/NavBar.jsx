import { useNavigate, Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthProvider.jsx";
// PrimeReact
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Image } from 'primereact/image';
import { TabMenu } from 'primereact/tabmenu';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

const NavBar = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Para leer la URL actual

    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        setAuth({});
        navigate('/links');
    }

    const logoIzq = (
        <div>
            <Image src="/tecnobus.png" alt="Image" width="40" className="mr-2" />
        </div>
    );

    const items = [
        { label: 'Link', icon: 'pi pi-link', url: '/links' },
        { label: 'Home', icon: 'pi pi-home', url: '/' },
        { label: 'Dashboard', icon: 'pi pi-home', url: '/dashboard' }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    // Ajustar activeIndex basado en la URL actual
    useEffect(() => {
        const path = location.pathname.toLowerCase();
        const index = items.findIndex(item => item.url.toLowerCase() === path);
        if (index !== -1) {
            setActiveIndex(index);
        }
    }, [location.pathname]); // Se actualiza cada vez que cambia la URL

    const links = (
        <div>
            <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => {
                setActiveIndex(e.index);
                navigate(items[e.index].url); // Navegar al hacer clic
            }} />
        </div>
    );

    const menuUsuario = auth ? (
        <Button onClick={() => navigate('/ingresar')} icon="pi pi-sign-in" />
    ) : (
        <Avatar className="p-overlay-badge" icon="pi pi-sign-out" size="medium" onClick={logout}>
            <Badge value="4" />
            {/* No borrar comentairo <Button onClick={logout} icon="pi pi-sign-out" />icon="pi pi-user"  */}
        </Avatar>
    );

    return (
        <div className="card">
            <Toolbar start={logoIzq} center={links} end={menuUsuario} style={{ padding: "15px" }} />
        </div>
    );
}

export default NavBar;
