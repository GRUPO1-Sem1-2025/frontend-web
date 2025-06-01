import { useNavigate, Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../../Context/AuthProvider.jsx";
import NavBar from "../../Componentes/NavBar.jsx";
import Footer from "../../Componentes/Footer.jsx";
import { Button } from "primereact/button";
import axios from "../../Configuraciones/axios.js";
import { Toast } from "primereact/toast";

const URL_LOCALIDADESCONTROLLER = "/localidades";
const URL_VIAJESCONTROLLER = "/viajes";

//PrimeReact
import { Image } from "primereact/image";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { CascadeSelect } from "primereact/cascadeselect";
import { FloatLabel } from "primereact/floatlabel";
import { ToggleButton } from "primereact/togglebutton";

const Home = () => {
  const toast = useRef(null);
  const [localidades, setLocalidades] = useState([]);
  const [error, setError] = useState(null);
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${URL_LOCALIDADESCONTROLLER}/obtenerLocalidadesActivas`)
      .then((response) => {
        setLocalidades(response.data);
      })
      .catch((err) => {
        setError("Error al cargar localidades");
        console.error(err);
      });
  }, []);
  const navigate = useNavigate();
  const handleContinuar = () => {
    navigate("../Venta/VentaPasaje", {
      state: {
        //pasajes,
        esIdaVuelta,
        lugarOrigen: locOrigen.cname,
        idOrigen: locOrigen.code,
        lugarDestino: locDestino.cname,
        idDestino: locDestino.code,
        fechaIda: fechaIda,
        fechaVuelta: fechaVuelta,
      },
    });
  };
  const fechaActual = new Date();
  //const [pasajes, setValue3] = useState(1);
  const [esIdaVuelta, setChecked] = useState(false);
  const [locOrigen, setLocOrigen] = useState(null);
  const [locDestino, setLocDestino] = useState(null);
  const [fechaIda, setFechaIda] = useState(null);
  const [fechaVuelta, setFechaVuelta] = useState(null);
  const porDepartamento = [];

  localidades.forEach((loc) => {
    // Buscar si ya existe ese departamento
    let grupo = porDepartamento.find((g) => g.name === loc.departamento);

    // Si no existe, lo crea agrega a la lista
    if (!grupo) {
      grupo = { name: loc.departamento, items: [] };
      porDepartamento.push(grupo);
    }

    // Agregamos la localidad al grupo correspondiente
    grupo.items.push({ cname: loc.nombre, code: loc.id });
  });

  const fetchViajes = async () => {
    if (locOrigen.code === locDestino.code) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "La localidad de origen y destino no pueden ser la misma",
        life: 3000,
      });
      setLoading = false;
      return;
    }
    try {
      const fechaIdaStr = fechaIda.toISOString().split("T")[0];

      const fechaFinIda = new Date(fechaIda);

      fechaFinIda.setDate(fechaIda.getDate() + 1);

      const fechaFinIdaStr = fechaFinIda.toISOString().split("T")[0];

      if (esIdaVuelta) {
      }

      // Solicitar viajes de Ida
      console.log("Fecha ida", fechaIdaStr);
      console.log("loc origen", locOrigen);
      console.log("loc destino", locDestino);
      const responseIda = await axios.get(
        `${URL_VIAJESCONTROLLER}/obtenerViajesPorFechaYDestino`,
        {
          params: {
            locOrigen: locOrigen.code,
            locDestino: locDestino.code,
            fechaInicio: fechaIdaStr,
            fechaFin: fechaFinIdaStr,
          },
        }
      );
      const viajesIda = responseIda.data;
      console.log("Datos recibidos del backend:", viajesIda);

      if (viajesIda.length === 0) {
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: esIdaVuelta
            ? "No hay viajes para esa fecha de ida"
            : "No hay viajes para esa fecha",
          life: 3000,
        });

        return;
      }
      // Obtener viajes vuelta
      let viajesVuelta = [];
      if (esIdaVuelta) {
        const fechaFinVuelta = new Date(fechaVuelta);
        fechaFinVuelta.setDate(fechaVuelta.getDate() + 1);
        const fechaVueltaStr = fechaVuelta.toISOString().split("T")[0];
        const fechaFinVueltaStr = fechaFinVuelta.toISOString().split("T")[0];

        const responseVuelta = await axios.get(
          `${URL_VIAJESCONTROLLER}/obtenerViajesPorFechaYDestino`,
          {
            params: {
              locOrigen: locDestino.code,
              locDestino: locOrigen.code,
              fechaInicio: fechaVueltaStr,
              fechaFin: fechaFinVueltaStr,
            },
          }
        );
        console.log("Datos recibidos del backend vuelta:", responseVuelta.data);
        viajesVuelta = responseVuelta.data;

        if (responseVuelta.data.length === 0) {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "No hay viajes para esa fecha de vuelta",
            life: 3000,
          });

          return;
        }
      }
      setLoading(true);
      navigate("../Venta/VentaPasaje", {
        state: {
          //pasajes,
          esIdaVuelta,
          lugarOrigen: locOrigen.cname,
          idOrigen: locOrigen.code,
          lugarDestino: locDestino.cname,
          idDestino: locDestino.code,
          fechaIda: fechaIda,
          fechaVuelta: fechaVuelta,
          viajes: viajesIda,
          viajesVuelta: viajesVuelta,
        },
      });
    } catch (err) {
      setError("Error al cargar viajes");
    }
  };

  return (
    <>
      <NavBar />
      <Toast ref={toast} />
      <div style={{ position: "relative", width: "100vw", overflow: "hidden" }}>
        {/* Imagen de fondo */}
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
          <Image
            // src="/paisajeHome.webp"
            alt="Paisaje Home"
            // style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          />

          {/* Contenido centrado dentro de la imagen */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              width: "90%",
              maxWidth: "600px",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "2rem",
              }}
            >
              Elige tú pasaje soñado
            </h1>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <ToggleButton
                onLabel="Ida y vuelta"
                offLabel="Pasaje ida"
                checked={esIdaVuelta}
                onChange={(e) => setChecked(e.value)}
              />
              {/*
              <label htmlFor="minmax-buttons" className="font-bold block mb-2">
                Pasajes
              </label>
              
              <InputNumber
                inputId="minmax-buttons"
                value={pasajes}
                onValueChange={(e) => setValue3(e.value)}
                mode="decimal"
                showButtons
                min={0}
                max={5}
              />
            */}
              <FloatLabel>
                <Calendar
                  value={fechaIda}
                  minDate={fechaActual}
                  onChange={(e) => setFechaIda(e.value)}
                  showIcon
                  dateFormat="dd/mm/yy"
                />
                <label> Fecha Ida </label>
              </FloatLabel>

              {esIdaVuelta && (
                <FloatLabel>
                  <Calendar
                    value={fechaVuelta}
                    minDate={fechaIda}
                    onChange={(e) => setFechaVuelta(e.value)}
                    showIcon
                    dateFormat="dd/mm/yy"
                  />
                  <label> Fecha Vuelta </label>
                </FloatLabel>
              )}

              <FloatLabel>
                <CascadeSelect
                  inputId="cs-city1"
                  value={locOrigen}
                  onChange={(e) => setLocOrigen(e.value)}
                  options={porDepartamento}
                  optionLabel="cname"
                  optionGroupLabel="name"
                  optionGroupChildren={["items"]}
                  className="w-full md:w-14rem"
                  breakpoint="767px"
                  style={{ minWidth: "14rem" }}
                />
                <label htmlFor="cs-city1">Origen</label>
              </FloatLabel>

              <FloatLabel>
                <CascadeSelect
                  inputId="cs-city"
                  value={locDestino}
                  onChange={(e) => setLocDestino(e.value)}
                  options={porDepartamento}
                  optionLabel="cname"
                  optionGroupLabel="name"
                  optionGroupChildren={["items"]}
                  className="w-full md:w-14rem"
                  breakpoint="767px"
                  style={{ minWidth: "14rem" }}
                />

                <label htmlFor="cs-city">Destino</label>
              </FloatLabel>
              <Button
                label="Continuar"
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  fetchViajes();
                }}
                disabled={
                  !locDestino ||
                  !locOrigen ||
                  !fechaIda ||
                  (esIdaVuelta && !fechaVuelta)
                }
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Home;
