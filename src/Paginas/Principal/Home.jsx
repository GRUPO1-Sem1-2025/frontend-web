import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../Context/AuthProvider.jsx";
import NavBar from '../../Componentes/NavBar.jsx';
import Footer from "../../Componentes/Footer.jsx";
// PrimeReact
import { Image } from 'primereact/image';
import { Calendar } from 'primereact/calendar';
import { CascadeSelect } from 'primereact/cascadeselect';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';

const Home = () => {
    const { auth } = useContext(AuthContext);

    // Si no está logueado, se renderiza la landing page
    if (!auth || !auth.token) {
        return (
    <div style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
    }}>
        {/* Fondo de video */}
        <video
            autoPlay
            loop
            muted
            playsInline
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                top: 0,
                left: 0,
                zIndex: -1
            }}
        >
            <source src="buses1.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
        </video>

        {/* Contenido centrado con animación */}
        <div style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.93)',
                padding: '2.5rem 2rem',
                borderRadius: '1.25rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                textAlign: 'center',
                animation: 'fadeInUp 1s ease-out',
                maxWidth: '500px',
                width: '90%'
            }}>
                {/* Logo */}
                <img src="/tecnobus.png" alt="TecnoBus"
                    style={{
                        maxWidth: '150px',
                        marginBottom: '1rem',
                        borderRadius: '12px'
                    }}
                />
                {/* Título */}
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#0B5394',
                    marginBottom: '0.5rem'
                }}>
                    Tecnobus Uy
                </h1>

                {/* Subtítulo */}
                <p style={{ color: '#444', marginBottom: '1.5rem' }}>
                    Por favor, ingresa para continuar.
                </p>

                {/* Botón */}
                <Link to="/ingresar">
                    <Button
                        label="Ingresar"
                        icon="pi pi-sign-in"
                        className="p-button-info"
                        style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                    />
                </Link>
            </div>
        </div>

        {/* Animación CSS */}
        <style>
            {`
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            `}
        </style>
    </div>
);

    }

    // Estado para fechas y selección de viaje
    const fechaActual = new Date().toISOString().split('T')[0];
    const [tripType, setTripType] = useState("ida"); // "ida" o "ida y vuelta"
    const [fechaIda, setFechaIda] = useState(fechaActual);
    const [fechaVuelta, setFechaVuelta] = useState(fechaActual);
    const [lugarElegido, setSelectedCity] = useState(null);
    const [lugarElegido2, setSelectedCity2] = useState(null);

    const departamentos = [
        {
            name: 'Australia',
            code: 'AU',
            states: [
                {
                    name: 'New South Wales',
                    cities: [
                        { cname: 'Sydney', code: 'A-SY' },
                        { cname: 'Newcastle', code: 'A-NE' },
                        { cname: 'Wollongong', code: 'A-WO' }
                    ]
                },
                {
                    name: 'Queensland',
                    cities: [
                        { cname: 'Brisbane', code: 'A-BR' },
                        { cname: 'Townsville', code: 'A-TO' }
                    ]
                }
            ]
        },
        {
            name: 'Canada',
            code: 'CA',
            states: [
                {
                    name: 'Quebec',
                    cities: [
                        { cname: 'Montreal', code: 'C-MO' },
                        { cname: 'Quebec City', code: 'C-QU' }
                    ]
                },
                {
                    name: 'Ontario',
                    cities: [
                        { cname: 'Ottawa', code: 'C-OT' },
                        { cname: 'Toronto', code: 'C-TO' }
                    ]
                }
            ]
        },
        {
            name: 'United States',
            code: 'US',
            states: [
                {
                    name: 'California',
                    cities: [
                        { cname: 'Los Angeles', code: 'US-LA' },
                        { cname: 'San Diego', code: 'US-SD' },
                        { cname: 'San Francisco', code: 'US-SF' }
                    ]
                },
                {
                    name: 'Florida',
                    cities: [
                        { cname: 'Jacksonville', code: 'US-JA' },
                        { cname: 'Miami', code: 'US-MI' },
                        { cname: 'Tampa', code: 'US-TA' },
                        { cname: 'Orlando', code: 'US-OR' }
                    ]
                },
                {
                    name: 'Texas',
                    cities: [
                        { cname: 'Austin', code: 'US-AU' },
                        { cname: 'Dallas', code: 'US-DA' },
                        { cname: 'Houston', code: 'US-HO' }
                    ]
                }
            ]
        }
    ];

    return (
        <>
            <NavBar />
            <div style={{ position: 'relative', width: '100vw', overflow: 'hidden' }}>
                {/* Imagen de fondo */}
                <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
                    <Image
                        // src="/paisajeHome.webp"
                        alt="Paisaje Home"
                    // style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                    />

                    {/* Contenido centrado dentro de la imagen */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: '2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        width: '90%',
                        maxWidth: '600px'
                    }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Buscar pasajes de ómnibus</h1>
                        
                        {/* Origen y Destino uno al lado del otro */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                            <FloatLabel style={{ flex: 1 }}>
                                <CascadeSelect
                                    inputId="cs-city1"
                                    value={lugarElegido}
                                    onChange={(e) => setSelectedCity(e.value)}
                                    options={departamentos}
                                    optionLabel="cname"
                                    optionGroupLabel="name"
                                    optionGroupChildren={['states', 'cities']}
                                    className="w-full md:w-14rem"
                                    breakpoint="767px"
                                    style={{ minWidth: '14rem' }}
                                />
                                <label htmlFor="cs-city1">Origen</label>
                            </FloatLabel>
                            <FloatLabel style={{ flex: 1 }}>
                                <CascadeSelect
                                    inputId="cs-city"
                                    value={lugarElegido2}
                                    onChange={(e) => setSelectedCity2(e.value)}
                                    options={departamentos}
                                    optionLabel="cname"
                                    optionGroupLabel="name"
                                    optionGroupChildren={['states', 'cities']}
                                    className="w-full md:w-14rem"
                                    breakpoint="767px"
                                    style={{ minWidth: '14rem' }}
                                />
                                <label htmlFor="cs-city">Destino</label>
                            </FloatLabel>
                        </div>
                        
                        {/* Botones de tipo de viaje */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                            <Button label="Ida" onClick={() => setTripType("ida")}
                                className={tripType === "ida" ? "p-button-warning" : "p-button-outlined"} />
                            <Button label="Ida y Vuelta" onClick={() => setTripType("ida y vuelta")}
                                className={tripType === "ida y vuelta" ? "p-button-warning" : "p-button-outlined"} />
                        </div>
                        
                        {/* Fechas y botón de búsqueda */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <div>
                                <Calendar value={fechaIda} onChange={(e) => setFechaIda(e.value)} showIcon />
                                <label>Fecha de Salida</label>
                            </div>
                            
                            {tripType === "ida y vuelta" && (
                                <div>
                                    <Calendar value={fechaVuelta} onChange={(e) => setFechaVuelta(e.value)} showIcon />
                                    <label>Fecha de Regreso</label>
                                </div>
                            )}
                            
                            <Button label="Buscar pasajes" style={{ marginTop: '1rem' }} />
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer />  Footer deshabilitado */}
        </>
    );
}

export default Home;