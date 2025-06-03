import { useNavigate, Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../../Context/AuthProvider.jsx";
import NavBar from "../../Componentes/NavBar.jsx";
//import Footer from "../../Componentes/Footer.jsx";
import { Image } from 'primereact/image';
import { Calendar } from 'primereact/calendar';
import { CascadeSelect } from 'primereact/cascadeselect';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';

const Home = () => {
    const { auth } = useContext(AuthContext);

    const fechaActual = new Date();
    const [tripType, setTripType] = useState("ida");
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
        }
    ];

    // Si no está logueado, mostrar landing con video de fondo
    if (!auth || !auth.token) {
        return (
            <div style={{
                position: 'relative',
                height: '100vh',
                overflow: 'hidden',
                fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
            }}>
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
                        <img src="/tecnobus.png" alt="TecnoBus"
                            style={{
                                maxWidth: '150px',
                                marginBottom: '1rem',
                                borderRadius: '12px'
                            }}
                        />
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: '#0B5394',
                            marginBottom: '0.5rem'
                        }}>
                            Tecnobus Uy
                        </h1>

                        <p style={{ color: '#444', marginBottom: '1.5rem' }}>
                            Por favor, ingresa para continuar.
                        </p>

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

    // Si está logueado, mostrar selector de pasajes
    return (
        <>
            <NavBar />
            <div style={{ position: 'relative', width: '100vw', overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
                    {/* Imagen de fondo si deseas */}
                    {/* <Image src="/paisajeHome.webp" alt="Paisaje Home" style={{ ... }} /> */}

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
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                            Buscar pasajes de ómnibus
                        </h1>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
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
                                    style={{ minWidth: '14rem' }}
                                />
                                <label htmlFor="cs-city1">Origen</label>
                            </FloatLabel>

                            <FloatLabel style={{ flex: 1 }}>
                                <CascadeSelect
                                    inputId="cs-city2"
                                    value={lugarElegido2}
                                    onChange={(e) => setSelectedCity2(e.value)}
                                    options={departamentos}
                                    optionLabel="cname"
                                    optionGroupLabel="name"
                                    optionGroupChildren={['states', 'cities']}
                                    className="w-full md:w-14rem"
                                    style={{ minWidth: '14rem' }}
                                />
                                <label htmlFor="cs-city2">Destino</label>
                            </FloatLabel>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
                            <Button label="Ida" onClick={() => setTripType("ida")}
                                className={tripType === "ida" ? "p-button-warning" : "p-button-outlined"} />
                            <Button label="Ida y Vuelta" onClick={() => setTripType("ida y vuelta")}
                                className={tripType === "ida y vuelta" ? "p-button-warning" : "p-button-outlined"} />
                        </div>

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
        </>
    );
};

export default Home;
