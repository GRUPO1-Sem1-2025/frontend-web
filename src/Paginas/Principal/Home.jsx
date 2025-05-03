import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../Context/AuthProvider.jsx";
import NavBar from '../../Componentes/NavBar.jsx';
import Footer from "../../Componentes/Footer.jsx";

//PrimeReact
import { Image } from 'primereact/image';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { CascadeSelect } from 'primereact/cascadeselect';
import { FloatLabel } from 'primereact/floatlabel';
import { ToggleButton } from 'primereact/togglebutton';

const Home = () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const [pasajes, setValue3] = useState(1);
    const [esIdaVuelta, setChecked] = useState(false);
    const [lugarElegido, setSelectedCity] = useState(null);

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
                },

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
                },

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
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Elige tú pasaje soñado</h1>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <ToggleButton
                                onLabel="Ida y vuelta"
                                offLabel="Pasaje ida"
                                checked={esIdaVuelta}
                                onChange={(e) => setChecked(e.value)}
                            />

                            <label htmlFor="minmax-buttons" className="font-bold block mb-2">Pasajes</label>
                            <InputNumber inputId="minmax-buttons" value={pasajes} onValueChange={(e) => setValue3(e.value)} mode="decimal" showButtons min={0} max={5} />

                            <div >
                                <Calendar value={fechaActual} onChange={(e) => setDate(e.value)} showIcon />
                            </div>
                            {esIdaVuelta && (
                                <div >
                                    <Calendar value={fechaActual} onChange={(e) => setDate(e.value)} showIcon />
                                </div>
                            )}

                            <FloatLabel>
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
                                <label htmlFor="cs-city1">City</label>
                            </FloatLabel>

                            <FloatLabel>
                                <CascadeSelect
                                    inputId="cs-city"
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
                                <label htmlFor="cs-city">City</label>
                            </FloatLabel>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home