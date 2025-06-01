import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from "./logoBase64.js"; // archivo con el logo en base64
import { Button } from "primereact/button";

// Asegurar que las fuentes estén correctamente asignadas
if (pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
  pdfMake.vfs = pdfFonts.vfs;
}

function formatearFecha(fecha) {
  const [dia, mes, anio] = fecha.split("/");
  const diaFormateado = dia.padStart(2, "0");
  const mesFormateado = mes.padStart(2, "0");
  const anioFormateado = anio.length === 2 ? "20" + anio : anio;
  return `${diaFormateado}/${mesFormateado}/${anioFormateado}`;
}

const PdfGenerator = ({ pasaje }) => {
  const generatePDF = () => {
    const contenidoCompleto = [];

    pasaje.asientos.forEach((asiento, index) => {
      const contenido = [
        {
          image: logo,
          width: 100,
          alignment: "center",
          margin: [0, 0, 20, 0],
        },
        "\n\n",
        { text: "Pasaje de Ómnibus", style: "header", alignment: "center" },
        {
          text: "Empresa: Tecnobus",
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
          ],
        },

        { text: "Datos del Pasajero", style: "sectionHeader" },
        {
          columns: [
            { text: "Nombre: " + pasaje.nombre + " " + pasaje.apellido },
            { text: "C.I.: " + pasaje.ci },
          ],
        },
        { text: "\n" },

        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
          ],
        },
        { text: "Datos del Viaje", style: "sectionHeader" },
        {
          columns: [
            { text: "Origen: " + pasaje.origen },
            { text: "Destino: " + pasaje.destino },
          ],
        },
        {
          columns: [
            {
              text: "Salida: " + pasaje.fechaSalida + " - " + pasaje.horaSalida,
            },
            {
              text:
                "Llegada: " + pasaje.fechaArribo + " - " + pasaje.horaArribo,
            },
          ],
        },
        {
          columns: [{ text: "Asiento: " + asiento }],
        },
        { text: "\n" },

        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
          ],
        },
        { text: "Pago", style: "sectionHeader" },
        {
          columns: [
            { text: "Comprado via: " + pasaje.via },
            { text: "Importe: $ " + pasaje.precio },
          ],
        },
        { text: "\n" },

        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
          ],
        },
        { text: "Observaciones", style: "sectionHeader" },
        {
          ul: [
            "Presentarse 30 minutos antes de la salida.",
            "Documento de identidad obligatorio.",
            "No se permiten cambios dentro de las 24 horas previas.",
          ],
        },
        { text: "\n" },

        {
          columns: [
            {
              stack: [
                {
                  text: "Control",
                  style: "label",
                },
                {
                  qr: `${pasaje.origen} - ${pasaje.destino} - ${pasaje.fechaSalida} - ${pasaje.horaSalida} - ${asiento}`,
                  fit: 100,
                  margin: [0, 20, 0, 10],
                },
              ],
              alignment: "left",
              width: "50%",
            },
            pasaje.origen === "Montevideo"
              ? {
                  stack: [
                    {
                      text: "Acceso a andenes",
                      style: "label",
                    },
                    {
                      qr: `TECNOBUS,${formatearFecha(pasaje.fechaSalida)},${
                        pasaje.horaSalida
                      },Si`,
                      fit: 100,
                      margin: [0, 20, 0, 10],
                    },
                  ],
                  alignment: "right",
                  width: "50%",
                }
              : {},
          ],
        },
      ];

      contenidoCompleto.push(...contenido);

      // Agrega un salto de página si no es el último pasaje
      if (index < pasaje.asientos.length - 1) {
        contenidoCompleto.push({ text: "", pageBreak: "after" });
      }
    });

    const docDefinition = {
      content: contenidoCompleto,
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          italics: true,
          margin: [0, 0, 0, 10],
        },
        sectionHeader: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 4],
          color: "#00B0F0",
        },
        label: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 4],
        },
      },
      defaultStyle: {
        fontSize: 11,
      },
    };

    pdfMake.createPdf(docDefinition).download("pasajes.pdf");
  };

  return <Button label="Descargar Pasajes" onClick={generatePDF} />;
};

export default PdfGenerator;
