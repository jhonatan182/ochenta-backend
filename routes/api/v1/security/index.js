const express = require('express');
let router = express.Router();
const Usuario = require('../../../../libs/usuarios');
const UsuarioDao = require('../../../../dao/mongodb/models/UsuarioDao');
const userDao = new UsuarioDao();
const user = new Usuario(userDao);
const servidorCorreo = require('../../../../config/nodemailer');
const { generarPassword } = require('../../../../helpers');

user.init();

const { jwtSign } = require('../../../../libs/security');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await user.getUsuarioByEmail({ email });

        if (!user.comparePasswords(password, userData.password)) {
            console.error('security login: ', {
                error: `Credenciales para usuario ${userData._id} ${userData.email} incorrectas.`,
            });

            return res.status(403).json({ error: 'Credenciales no Válidas' });
        }
        const { password: passwordDb, created, updated, ...jwtUser } = userData;

        const jwtToken = await jwtSign({
            jwtUser,
            generated: new Date().getTime(),
        });

        return res.status(200).json({ token: jwtToken });
    } catch (ex) {
        console.error('security login: ', { ex });

        return res
            .status(500)
            .json({ error: 'No es posible procesar la solicitud.' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email = '', password = '' } = req.body;

        if (/^\s*$/.test(email)) {
            return res.status(400).json({
                error: 'Se espera valor de correo',
            });
        }

        if (/^\s*$/.test(password)) {
            return res.status(400).json({
                error: 'Se espera valor de contraseña correcta',
            });
        }
        const newUsuario = await user.addUsuarios({
            email,
            nombre: 'John Doe',
            avatar: '',
            password,
            estado: 'ACT',
        });
        return res.status(200).json(newUsuario);
    } catch (ex) {
        console.error('security signIn: ', ex);
        return res.status(502).json({ error: 'Error al procesar solicitud' });
    }
});

router.post('/olvide-password', async (req, res) => {
    const { email } = req.body;

    if (/^\s*$/.test(email)) {
        return res.status(400).json({
            error: 'Se espera valor de email',
        });
    }

    //comprobando que el usuario exista
    const usuarioExiste = await user.getUsuarioByEmail({ email });

    if (!usuarioExiste) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    const passwordTemporal = generarPassword();

    try {
        const transporter = await servidorCorreo();

        await user.updateUsuario({
            codigo: usuarioExiste._id,
            email: usuarioExiste.email,
            nombre: usuarioExiste.nombre,
            avatar: usuarioExiste.avatar,
            password: passwordTemporal,
            estado: usuarioExiste.estado,
        });

        await transporter.sendMail({
            from: process.env.correo_app, // sender address
            to: usuarioExiste.email, // list of receivers
            subject: 'Cambio de contraseña ✔', // Subject line
            text: 'Ochenta App', // plain text body
            html: `Tu nueva contraseña temporar es: ${passwordTemporal}`, // html body
        });

        res.json({
            msg: `Hemos enviado un correo a la direccion ${usuarioExiste.email} con las instrucciones`,
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
