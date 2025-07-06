import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../Context/AuthProvider.jsx";
// PrimeReact
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Image } from "primereact/image";
import { TabMenu } from "primereact/tabmenu";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";

const NavBar = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    navigate("/");
  };

  const logoIzq = (
    <div>
      <Image src="/tecnobus.png" alt="Logo" width="70" className="mr-2" />
    </div>
  );

  const items = [
    { label: "Home", icon: "pi pi-home", url: "/" },
    { label: "Lista Viajes", icon: "pi pi-list", url: "/listaViajes" },
    // { label: "Perfil", icon: "pi pi-user", url: "/perfil" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const index = items.findIndex((item) => item.url.toLowerCase() === path);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location.pathname]);

  const links = (
    <div>
      <TabMenu
        style={{ maxHeight: "90px", maxWidth: "auto" }}
        model={items}
        activeIndex={activeIndex}
        onTabChange={(e) => {
          setActiveIndex(e.index);
          navigate(items[e.index].url);
        }}
      />
    </div>
  );

  const menuItems = [
    {
      label: "Perfil de Usuario",
      icon: "pi pi-user",
      command: () => navigate("/perfil"),
    },
    {
      label: "Mis Viajes",
      icon: "pi pi-user",
      command: () => navigate("/viajesUsuario"),
    },
    {
      label: "Cerrar sesión",
      icon: "pi pi-sign-out",
      command: logout,
    },
  ];

  const menuUsuario = auth ? (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Avatar
        label={auth?.nombreUsuario?.charAt(0)?.toUpperCase() || "U"}
        size="medium"
        shape="circle"
        style={{ backgroundColor: "#2196F3", color: "#fff", cursor: "pointer" }}
        onClick={(e) => menuRef.current.toggle(e)}
      />
      <span
        style={{
          fontWeight: "500",
          color: "#333",
          maxWidth: "150px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {auth?.nombreUsuario || "Usuario"}
      </span>
      <Menu model={menuItems} popup ref={menuRef} />
    </div>
  ) : (
    <Button onClick={() => navigate("/ingresar")} icon="pi pi-sign-in" />
  );

  return (
    <div className="card">
      <Toolbar
        start={logoIzq}
        center={links}
        end={menuUsuario}
        style={{
          paddingTop: "7px",
          paddingLeft: "15px",
          paddingRight: "15px",
          paddingBottom: "1px",
        }}
      />
    </div>
  );
};

export default NavBar;
