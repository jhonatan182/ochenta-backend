const nodemailer = require('nodemailer');

const servidorCorreo = async () => {
    const transporter = nodemailer.createTransport({
        host: process.env.correo_servicio,
        port: process.env.correo_port,
        secure: true,
        auth: {
            user: process.env.correo_app,
            pass: process.env.correo_contrasena,
        },
    });

    try {
        await transporter.verify();
        //console.log('el server puede enviar correos');
    } catch (error) {
        console.log(error);
    }

    return transporter;
};

module.exports = servidorCorreo;
