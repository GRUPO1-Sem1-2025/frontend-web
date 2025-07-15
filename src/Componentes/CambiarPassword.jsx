/**
 * CambiarPassword.jsx
 *
 * Permite cambiar la contraseña de un usuario.  ✔️
 * – Obtiene el email desde:
 *     1. Prop `propEmail`
 *     2. `location.state?.email`
 *     3. `localStorage.auth`  (clave JSON con { email, … })
 * – Habilita el botón **“Cambiar”** solo cuando el formulario es válido.
 * – Muestra notificaciones con el componente <Noti ref={toastRef} />.
 */

import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input2 from './Input.jsx';
import Noti from './MsjNotificacion.jsx';
import AuthContext from '../Context/AuthProvider.jsx';

// PrimeReact
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

// Conexión
import axios from '../Configuraciones/axios.js';
const URL_USUARIOSCONTROLLER = '/usuarios';

export default function CambiarPassword({ usaHeader = true, propEmail = null }) {
  // ------- ESTADO DEL FORMULARIO -------
  const [post, setPost] = useState({
    email: '',
    old_pass: '',
    new_pass: '',
    new_pass1: '',
  });

  const [esValido, setEsValido] = useState(false);
  const [loading, setLoading] = useState(false);

  // ------- RUTEO & CONTEXTO -------
  const navigate = useNavigate();
  const location = useLocation();
  const toastRef = useRef();
  const { setAuth } = useContext(AuthContext); // solo para limpiar credenciales

  // -------------------------------------------------------------------
  // 1️⃣  OBTERNER EMAIL DESDE props / location.state / localStorage.auth
  // -------------------------------------------------------------------
  useEffect(() => {
    let email = propEmail || location.state?.email;

    if (!email) {
      try {
        const authStr = localStorage.getItem('auth');
        const auth = authStr ? JSON.parse(authStr) : null;
        email = auth?.email || '';
      } catch (e) {
        console.error('No se pudo parsear localStorage.auth:', e);
      }
    }

    setPost(prev => ({ ...prev, email })); // solo cableamos email
  }, [propEmail, location.state?.email]);

  // -------------------------------------------------------------------
  // 2️⃣  VALIDAR FORMULARIO CADA VEZ QUE SE MODIFIQUE `post`
  // -------------------------------------------------------------------
  useEffect(() => {
    const valido =
      post.email.trim() &&
      post.old_pass.trim() &&
      post.new_pass.trim() &&
      post.new_pass1.trim() &&
      post.new_pass === post.new_pass1 &&
      post.old_pass !== post.new_pass;

    setEsValido(valido);
  }, [post]);

  // -------------------------------------------------------------------
  // 3️⃣  SUBMIT
  // -------------------------------------------------------------------
  const handleSubmit = async e => {
    e.preventDefault();

    if (!esValido) {
      toastRef.current?.notiAdvertencia('Complete todos los campos correctamente');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${URL_USUARIOSCONTROLLER}/cambiarContrasenia`,
        JSON.stringify(post),
        { headers: { 'Content-Type': 'application/json' } },
      );

      setAuth({}); // limpia contexto de auth
      toastRef.current?.notiExito('Contraseña actualizada. Inicie sesión nuevamente.');
      navigate('/ingresar', { replace: true });
    } catch (err) {
      let msg = '';
      if (!err?.response) {
        msg = 'No responde el servidor:\n' + err;
      } else {
        switch (err.response.status) {
          case 400:
            msg = 'Las nuevas contraseñas no coinciden';
            break;
          case 409:
            msg = 'La contraseña anterior no es correcta';
            break;
          case 500:
            msg = 'Usuario no encontrado';
            break;
          default:
            msg = 'Error al cambiar la contraseña';
        }
      }
      toastRef.current?.notiError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ------- HEADER (solo en versión modal / login) -------
  const header =
    usaHeader && (
      <img
        alt="Card"
        src="/tecnobus.png"
        style={{
          width: '100%',
          maxWidth: '500px',
          minWidth: '400px',
          height: '250px',
          objectFit: 'cover',
          display: 'block',
          borderRadius: '1%',
        }}
      />
    );

  // -------------------------------------------------------------------
  // 4️⃣  RENDER
  // -------------------------------------------------------------------
  return (
    <div
      className={usaHeader ? 'rectangulo-centrado' : ''}
      style={{
        padding: 0,
        ...(usaHeader === false && { display: 'flex', justifyContent: 'center' }),
      }}
    >
      <Card
        title={usaHeader ? 'Recuperación de contraseña' : 'Cambiar Contraseña'}
        header={header}
        style={{ maxWidth: '420px', textAlign: 'center' }}
      >
        <Noti ref={toastRef} />

        <form onSubmit={handleSubmit}>
          <div className="card flex justify-content-center">
            {/* -- contraseña actual -- */}
            <Input2
              type="password"
              titulo="Contraseña anterior"
              value={post.old_pass}
              onChange={e => setPost(prev => ({ ...prev, old_pass: e.target.value }))}
              required
            />

            {/* -- contraseña nueva -- */}
            <Input2
              type="password"
              titulo="Contraseña nueva"
              value={post.new_pass}
              onChange={e => setPost(prev => ({ ...prev, new_pass: e.target.value }))}
              required
            />

            <Input2
              type="password"
              titulo="Confirmar contraseña"
              descripcion="Debe coincidir con la contraseña nueva."
              value={post.new_pass1}
              onChange={e => setPost(prev => ({ ...prev, new_pass1: e.target.value }))}
              required
            />
          </div>

          <p style={{ marginTop: '0.2em' }}>
            <Button label="Cancelar" type="button" onClick={() => navigate('/')} severity="secondary" />
            <Button
              label="Cambiar"
              type="submit"
              style={{ marginLeft: '0.5em' }}
              disabled={!esValido}
              loading={loading}
            />
          </p>
        </form>
      </Card>
    </div>
  );
}
