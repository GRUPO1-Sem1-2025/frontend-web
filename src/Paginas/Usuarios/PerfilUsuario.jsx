// src/Paginas/PerfilUsuario.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import NavBar from "../../Componentes/NavBar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import axios from "axios";
import AuthContext from "../../Context/AuthProvider";

const logoSrc = "/tecnobus.png";

/* ────────────────────────────────────────── *
 * Utilidades de fecha                        *
 * ────────────────────────────────────────── */

/** Convierte "YYYY-MM-DD" a "DD-MM-YYYY" para mostrar. */
const formatoMostrar = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("T")[0].split("-"); // por si viene con hora
  return `${d}-${m}-${y}`;
};

const PerfilUsuario = () => {
  const { setAuth } = useContext(AuthContext);
  const toast = useRef(null);

  /* ─────────── State ─────────── */
  const [usuario, setUsuario] = useState({
    id: null,
    nombre: "",
    apellido: "",
    email: "",
    cedula: "",
    fechaNacimiento: "", // guardado siempre en formato ISO YYYY-MM-DD
  });

  const [editando, setEditando] = useState({
    nombre: false,
    apellido: false,
    email: false,
    cedula: false,
    fechaNacimiento: false,
  });

  /* ─────────── Cargar datos al montar ─────────── */
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const storedAuth = localStorage.getItem("auth");
        if (!storedAuth) return;

        const { email } = JSON.parse(storedAuth);
        const { data } = await axios.get(
          `https://backend.tecnobus.uy/usuarios/emails/?email=${email}`
        );
        const u = data.OK;

        setUsuario({
          id: u.id ?? null,
          nombre: u.nombre ?? "",
          apellido: u.apellido ?? "",
          email: u.email ?? "",
          cedula: u.ci ?? "",
          fechaNacimiento: u.fechaNac ?? "",
        });
      } catch (err) {
        console.error("Error al cargar el usuario:", err);
      }
    };

    cargarUsuario();
  }, []);

  /* ─────────── Handlers ─────────── */
  const handleInputChange = (e, campo) => {
    setUsuario((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const toggleEdit = (campo) => {
    setEditando((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  const handleGuardar = async () => {
    try {
      const payload = {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      };

      await axios.post(
        "https://backend.tecnobus.uy/usuarios/modificarPerfil",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // Actualizar localStorage y contexto global
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const authParsed = JSON.parse(storedAuth);
        authParsed.nombreUsuario = usuario.nombre;
        authParsed.email = usuario.email;
        localStorage.setItem("auth", JSON.stringify(authParsed));
      }
      setAuth((prev) => ({
        ...prev,
        email: usuario.email,
        nombreUsuario: usuario.nombre,
      }));

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Perfil actualizado correctamente",
        life: 3000,
      });
    } catch (err) {
      console.error("Error al guardar los cambios:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Hubo un error al actualizar el perfil",
        life: 3000,
      });
    }
  };

  const handleDesactivarCuenta = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas desactivar tu cuenta? Esta acción no se puede deshacer."
      )
    )
      return;

    try {
      const formData = new FormData();
      formData.append("email", usuario.email);

      await axios.post(
        "https://backend.tecnobus.uy/usuarios/borrarUsuario",
        formData
      );

      localStorage.removeItem("auth");
      window.location.href = "/";
    } catch (err) {
      console.error("Error al desactivar la cuenta:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo desactivar la cuenta",
        life: 3000,
      });
    }
  };

  /* ─────────── Render ─────────── */
  return (
    <>
      <NavBar />
      <Toast ref={toast} />
      <div className="rectangulo-centrado">
        <Card className="cardCentrada" style={{ backgroundColor: "#c9f0ff" }}>
          {/* Avatar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                border: "4px solid white",
                backgroundColor: "#fff",
              }}
            >
              <img
                src={logoSrc}
                alt="Logo Tecnobus"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            Mi Perfil
          </h2>

          {["nombre", "apellido", "email", "cedula", "fechaNacimiento"].map(
            (campo) => {
              const esSoloLectura = campo === "fechaNacimiento";
              // campo === 'email' || campo === 'fechaNacimiento';

              return (
                <div key={campo} style={{ marginBottom: "0.45rem" }}>
                  <label
                    htmlFor={campo}
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: ".5rem",
                    }}
                  >
                    {campo === "fechaNacimiento"
                      ? "Fecha de nacimiento"
                      : campo.charAt(0).toUpperCase() + campo.slice(1)}
                  </label>

                  <span
                    className="p-input-icon-right"
                    style={{ width: "100%" }}
                  >
                    <InputText
                      id={campo}
                      value={
                        campo === "fechaNacimiento"
                          ? formatoMostrar(usuario[campo])
                          : usuario[campo]
                      }
                      onChange={(e) => handleInputChange(e, campo)}
                      disabled={esSoloLectura || !editando[campo]}
                      style={{ width: "100%" }}
                    />

                    {/* Icono lápiz solo si se puede editar */}
                    {!esSoloLectura && (
                      <i
                        className="pi pi-pencil"
                        onClick={() => toggleEdit(campo)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </span>
                </div>
              );
            }
          )}

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <span
              onClick={handleDesactivarCuenta}
              style={{
                color: "darkred",
                textDecoration: "underline",
                display: "inline-block",
                marginBottom: "1rem",
                cursor: "pointer",
              }}
            >
              Desactivar mi cuenta
            </span>
            <br />
            <Button
              label="Guardar"
              onClick={handleGuardar}
              className="p-button-secondary"
              style={{ marginTop: "1rem", width: "60%" }}
            />
            <div style={{ marginTop: "1rem" }}>
              <Link
                to="/CambiarPassword"
                style={{ color: "#007bff", textDecoration: "underline" }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default PerfilUsuario;
