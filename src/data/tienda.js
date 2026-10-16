// Datos públicos de la tienda. Origen: src/data/tienda.js y backend/app/tienda.py del
// sitio anterior (referencia/), más las decisiones de Fernando del 15-oct-2026
// (correo .com). No se inventa ningún dato de contacto.

export const tienda = {
  nombre: 'El Chico Naturista',
  lema: 'Productos naturales del Perú',
  lemaPie: 'Productos naturales que se pueden rastrear hasta quien los cosecha. Sin promesas milagrosas.',
  // WhatsApp en formato internacional, sin + ni espacios
  whatsapp: '51946049689',
  whatsappVisible: '+51 946 049 689',
  correo: 'contacto@elchiconaturista.com',
  direccion: 'Las Camelias, Mz. K Lt. 17, Los Olivos, Lima',
  horario: 'Lunes a sábado, 9:00 a 19:00',
  redes: {
    tiktok: 'https://www.tiktok.com/@el.chico.naturista',
    linkedin: 'https://www.linkedin.com/company/el-chico-naturista/',
  },
  metodosPago: 'Puedes pagar con Yape, Plin o transferencia bancaria. Te pasamos los datos por WhatsApp al confirmar.',
  avisos: [
    'Envío gratis en todo el Perú desde S/ 120',
    'Delivery el mismo día en Lima',
    'Pedidos coordinados por WhatsApp, sin pasarela de pago',
  ],
  avisoSuplementos: 'Los suplementos no son medicamentos y no reemplazan una alimentación variada.',
};

/** Enlace wa.me con el mensaje ya escrito (siempre codificado). */
export const enlaceWhatsapp = (mensaje) =>
  `https://wa.me/${tienda.whatsapp}?text=${encodeURIComponent(mensaje)}`;
