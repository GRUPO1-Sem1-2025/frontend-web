const Footer = () => {
    return (
        <>
            <footer class="footer">
                <div class="footer-content">
                    <div class="footer-column">
                        <h3>Explorar</h3>
                        <ul>
                            <li><a href="#">Inicio</a></li>
                            <li><a href="#">Destinos</a></li>
                            <li><a href="#">Ofertas</a></li>
                            <li><a href="#">Servicios</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3>Información</h3>
                        <ul>
                            <li><a href="#">Contacto</a></li>
                            <li><a href="#">Trabaja con nosotros</a></li>
                            <li><a href="#">Correo de contacto</a></li>
                            <li><a href="#">Política de privacidad</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3>Sobre Nosotros</h3>
                        <img src="/tecnobus.png" alt="Logo Tecnobus" class="footer-logo" />
                        <div class="payments">
                            <img src="/stripe-logo.png" alt="Métodos de pago" class="payment-logo" />
                        </div>
                    </div>

                    <div class="footer-column">
                        <h3>Redes Sociales</h3>
                        <ul>
                            <li><a href="#">Facebook</a></li>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">X</a></li>
                        </ul>
                    </div>
                </div>

                <hr class="footer-divider" />

                <div class="footer-bottom">
                    <p>&copy; 2025 Tecnobus. Todos los derechos reservados.</p>
                    <p>Diseñado con amor para tus viajes soñados.</p>
                </div>
            </footer>
        </>
    )
}

export default Footer