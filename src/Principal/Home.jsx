import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider.jsx";
//PrimeReact
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Image } from 'primereact/image';
import { TabMenu } from 'primereact/tabmenu';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

const Home = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        setAuth({});
        navigate('/links');
    }
    const items = [
        { label: 'Link', icon: 'pi pi-link', url: '/links' },
        { label: 'Dashboard', icon: 'pi pi-home', url: '/Dashboard' }
    ];

    const startContent = (
        <>
            <div>
                <Image src="/tecnobus.png" alt="Image" width="75" className="mr-2" />
            </div>
        </>
    );

    const centerContent = (
        <>
            <div>
                <TabMenu model={items} />
            </div>
        </>
    );

    const endContent = auth ? (
        <Button onClick={() => navigate('/ingresar')} icon="pi pi-sign-in" />
    ) : (
        <Avatar className="p-overlay-badge" icon="pi pi-sign-out" size="xlarge" onClick={logout}>
            <Badge value="4" />
            {/* <Button onClick={logout} icon="pi pi-sign-out" />icon="pi pi-user"  */}
        </Avatar>
    );
    
    const date = new Date().toISOString().split('T')[0];
    
    return (
        <>
            <div className="card">
                <Toolbar start={startContent} center={centerContent} end={endContent} style={{ padding: "15px" }} />
            </div>
            <div className="card">
                <h1>Elige tú pasaje soñado</h1>
                <Image src="/paisajeHome.webp" alt="Image" width="100%" />
                <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-inputgroup flex-1">
                        <Calendar value={date} onChange={(e) => setDate(e.value)} showIcon />
                    </div>

                    <div className="p-inputgroup flex-1">
                        <Calendar value={date} onChange={(e) => setDate(e.value)} showIcon />
                    </div>

                    <div className="p-inputgroup flex-1">
                        <Button icon="pi pi-check" className="p-button-success" />
                        <InputText placeholder="Vote" />
                        <Button icon="pi pi-times" className="p-button-danger" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
