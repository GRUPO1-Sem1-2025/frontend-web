import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../Context/AuthProvider.jsx";
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
        setAuth({});
        navigate('/ingresar'); // Redirige al login/landing para usuarios no autenticados
    }

    const logoIzq = (
        <div>
            <Image src="/tecnobus.png" alt="Image" width="70" className="mr-2" />
        </div>
    );


    const items = [];
    
    items.push({ label: 'Home', icon: 'pi pi-home', url: '/' });
    
    if (auth?.rol === 100) {
        //en caso de haber otros items de cliente
    } else if (auth?.rol === 200 || auth?.rol === 300) {
        items.push(
            { label: 'Link', icon: 'pi pi-link', url: '/links' },
            { label: 'Dashboard', icon: 'pi pi-home', url: '/dashboard' }
        );
    }

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
        <div >
            <TabMenu style={{ maxHeight: "90px", maxWidth: "auto" }} model={items} activeIndex={activeIndex} onTabChange={(e) => {
                setActiveIndex(e.index);
                navigate(items[e.index].url); // Navegar al hacer clic
            }} />
        </div>
    );

    console.log("Variable sesión actual", auth);
    const menuUsuario = auth ? (
        <Avatar className="p-overlay-badge" icon="pi pi-sign-out" size="medium" onClick={logout}>
            <label>{auth?.email?.length > 4 ? auth?.email.slice(0, 4) + "..." : auth?.email}</label>
            {/* No borrar comentairo <Button onClick={logout} icon="pi pi-sign-out" />icon="pi pi-user"  */}
        </Avatar>
    ) : (
        <Button onClick={() => navigate('/ingresar')} icon="pi pi-sign-in" />
    );

    return (
        <div className="card" >
            <Toolbar start={logoIzq} center={links} end={menuUsuario} style={{ paddingTop: "7px", paddingLeft: "15px", paddingRight: "15px", paddingBottom: "1px" }} />
        </div>
    );
}

export default NavBar;
