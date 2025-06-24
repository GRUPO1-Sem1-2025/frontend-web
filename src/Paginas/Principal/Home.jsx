import { useNavigate, Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../../Context/AuthProvider.jsx";
import NavBar from "../../Componentes/NavBar.jsx";
import Footer from "../../Componentes/Footer.jsx";
import axios from "../../Configuraciones/axios.js";
import { Toast } from "primereact/toast";

// PrimeReact
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { CascadeSelect } from "primereact/cascadeselect";
import { FloatLabel } from "primereact/floatlabel";

// Firebase
import { solicitarPermisoYObtenerToken } from "../../firebase-token"; // Ajusta si cambia la ruta

const URL_LOCALIDADESCONTROLLER = "/localidades";
const URL_VIAJESCONTROLLER = "/viajes";
const URL_REGISTRO_TOKEN = "https://notificaciones.tecnobus.uy/usuarios/token";

const Home = () => {
  const { auth } = useContext(AuthContext);
  const toast = useRef(null);
  const navigate = useNavigate();

  const [localidades, setLocalidades] = useState([]);
  const [locOrigen, setLocOrigen] = useState(null);
  const [locDestino, setLocDestino] = useState(null);
  const [fechaIda, setFechaIda] = useState(null);
  const [fechaVuelta, setFechaVuelta] = useState(null);
  const [esIdaVuelta, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const fechaActual = new Date();

  const yaPidioPermiso = useRef(false);

  // 🚀 Pedir permiso de notificaciones y registrar token
  /*
  useEffect(() => {
    if (auth?.token && auth?.id && !yaPidioPermiso.current) {
      yaPidioPermiso.current = true;

      solicitarPermisoYObtenerToken()
        .then((tokenFCM) => {
          return axios.post(URL_REGISTRO_TOKEN, {
            usuarioId: auth.id,
            token: tokenFCM,
          });
        })
        .then(() => {
          console.log("✅ Token registrado correctamente");
        })
        .catch((err) => {
          console.error("❌ Error con notificaciones:", err.message);
        });
    }
  }, [auth]);
*/

useEffect(() => {
  if (auth?.token && !yaPidioPermiso.current) {
    yaPidioPermiso.current = true;

    function parseJwt(token) {
      if (!token) return null;
      const base64Payload = token.split('.')[1];
      if (!base64Payload) return null;
      const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
      try {
        return JSON.parse(payload);
      } catch {
        return null;
      }
    }

    const payload = parseJwt(auth.token);
    const userId = payload?.id; // ahora sacás el id

    if (!userId) {
      console.error("No se pudo obtener id del token JWT");
      return;
    }

    solicitarPermisoYObtenerToken()
      .then((tokenFCM) => {
        return axios.post(URL_REGISTRO_TOKEN, {
          usuarioId: userId, // uso el id aquí
          token: tokenFCM,
        });
      })
      .then(() => {
        console.log("✅ Token registrado correctamente");
      })
      .catch((err) => {
        console.error("❌ Error con notificaciones:", err.message);
      });
  }
}, [auth]);

  useEffect(() => {
    axios
      .get(`${URL_LOCALIDADESCONTROLLER}/obtenerLocalidadesActivas`)
      .then((res) => setLocalidades(res.data))
      .catch((err) => {
        console.error("Error al cargar localidades", err);
      });
  }, []);

  const porDepartamento = [];
  localidades.forEach((loc) => {
    let grupo = porDepartamento.find((g) => g.name === loc.departamento);
    if (!grupo) {
      grupo = { name: loc.departamento, items: [] };
      porDepartamento.push(grupo);
    }
    grupo.items.push({ cname: loc.nombre, code: loc.id });
  });

  const fetchViajes = async () => {
    if (locOrigen?.code === locDestino?.code) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "La localidad de origen y destino no pueden ser la misma",
        life: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const fechaIdaStr = fechaIda.toISOString().split("T")[0];
      const fechaFinIda = new Date(fechaIda);
      fechaFinIda.setDate(fechaIda.getDate() + 1);
      const fechaFinIdaStr = fechaFinIda.toISOString().split("T")[0];

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

      if (responseIda.data.length === 0) {
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

      let viajesVuelta = [];
      if (esIdaVuelta) {
        const fechaVueltaStr = fechaVuelta.toISOString().split("T")[0];
        const fechaFinVuelta = new Date(fechaVuelta);
        fechaFinVuelta.setDate(fechaVuelta.getDate() + 1);
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
        viajesVuelta = responseVuelta.data;

        if (viajesVuelta.length === 0) {
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

      navigate("../Venta/VentaPasaje", {
        state: {
          esIdaVuelta,
          lugarOrigen: locOrigen.cname,
          idOrigen: locOrigen.code,
          lugarDestino: locDestino.cname,
          idDestino: locDestino.code,
          fechaIda,
          fechaVuelta,
          viajes: responseIda.data,
          viajesVuelta,
        },
      });
    } catch (err) {
      console.error("Error al buscar viajes", err);
      setLoading(false);
    }
  };

  if (!auth?.token) {
    return (
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source src="buses1.mp4" type="video/mp4" />
          Tu navegador no soporta el video.
        </video>
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.93)",
              padding: "2.5rem 2rem",
              borderRadius: "1.25rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              textAlign: "center",
              maxWidth: "500px",
              width: "90%",
            }}
          >
            <img
              src="/tecnobus.png"
              alt="TecnoBus"
              style={{ maxWidth: "150px", marginBottom: "1rem" }}
            />
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#0B5394" }}>
              Tecnobus Uy
            </h1>
            <p style={{ color: "#444", marginBottom: "1.5rem" }}>
              Por favor, ingresa para continuar.
            </p>
            <Link to="/ingresar">
              <Button label="Ingresar" icon="pi pi-sign-in" className="p-button-info" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <Toast ref={toast} />
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            textAlign: "center",
            width: "90%",
            maxWidth: "600px",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
            Buscar pasajes de ómnibus
          </h1>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
            <Button
              label="Ida"
              onClick={() => setChecked(false)}
              className={!esIdaVuelta ? "p-button-warning" : "p-button-outlined"}
            />
            <Button
              label="Ida y vuelta"
              onClick={() => setChecked(true)}
              className={esIdaVuelta ? "p-button-warning" : "p-button-outlined"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            <FloatLabel>
              <Calendar
                value={fechaIda}
                minDate={fechaActual}
                onChange={(e) => setFechaIda(e.value)}
                showIcon
                dateFormat="dd/mm/yy"
              />
              <label>Fecha Ida</label>
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
                <label>Fecha Vuelta</label>
              </FloatLabel>
            )}

            <FloatLabel>
              <CascadeSelect
                value={locOrigen}
                onChange={(e) => setLocOrigen(e.value)}
                options={porDepartamento}
                optionLabel="cname"
                optionGroupLabel="name"
                optionGroupChildren={["items"]}
                style={{ minWidth: "14rem" }}
              />
              <label>Origen</label>
            </FloatLabel>

            <FloatLabel>
              <CascadeSelect
                value={locDestino}
                onChange={(e) => setLocDestino(e.value)}
                options={porDepartamento}
                optionLabel="cname"
                optionGroupLabel="name"
                optionGroupChildren={["items"]}
                style={{ minWidth: "14rem" }}
              />
              <label>Destino</label>
            </FloatLabel>

            <Button
              label="Buscar pasajes"
              loading={loading}
              onClick={() => {
                setLoading(true);
                fetchViajes();
              }}
              disabled={!locOrigen || !locDestino || !fechaIda || (esIdaVuelta && !fechaVuelta)}
            />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Home;
