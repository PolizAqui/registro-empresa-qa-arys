const pool = require('../utils/mysql.connect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { KEY } = require('../global/_var');

const getUser = async ({ cedula_rif }) => {
    try {
        let msg = {
            status: false,
            message: 'Aliado not Found',
            code: 404
        };

        const connection = await pool.getConnection();
        let sql = `SELECT cedula_rif FROM aliados WHERE cedula_rif = ?`;
        const [user] = await connection.execute(sql, [cedula_rif]);

        if (user.length > 0) {
            msg = {
                status: true,
                message: 'Rif found',
                dataUser: user,
                code: 200
            };
        }

        connection.release();
        return msg;

    } catch (err) {
        console.error('Error in getUser:', err);
        let msg = {
            status: false,
            message: 'Error en el servidor',
            code: 500,
            error: err
        };

        return msg;
    }
};

const saveUser = async ({ cedula_rif, nombre, telefono, email, direccion, comision, password }) => {
    try {
        let msg = {
            status: false,
            message: 'Aliado not Registered',
            code: 500
        };

        const connection = await pool.getConnection();

        // Verificar si el correo ya existe
        const sqlCheckEmail = `SELECT email FROM aliados WHERE email = ?`;
        const [existingEmail] = await connection.execute(sqlCheckEmail, [email]);

        if (existingEmail.length > 0) {
            connection.release();
            return {
                status: false,
                message: 'El correo ya está registrado',
                code: 400
            };
        }

        let hash = null;
        if (password) {
            hash = await bcrypt.hash(password, 10);
            console.log('Generated hash:', hash);
        }

        const fechaActual = new Date();
        const date_created = fechaActual.toISOString().split('T')[0];

        let tokenLic = {
            email: email,
            nombre: nombre,
            cedula_rif: cedula_rif,
            telefono: telefono,
            direccion: direccion,
            date_created: date_created
        };

        const token = jwt.sign(tokenLic, KEY, { algorithm: 'HS256' });

        let sql = `INSERT INTO aliados (cedula_rif, nombre, telefono, email, direccion, password) VALUES (?, ?, ?, ?, ?, ?)`;
        let sql1 = `INSERT INTO empresas (rif_empresa, nombre_empresa) VALUES (?, ?)`;

        const [user] = await connection.execute(sql, [cedula_rif, nombre, telefono, email, direccion, hash]);
        const [user1] = await connection.execute(sql1, [cedula_rif, nombre]);

        if (user.affectedRows > 0 && user1.affectedRows > 0) {
            msg = {
                status: true,
                message: 'Aliado registered successfully',
                code: 200
            };
        }

        connection.release();
        return msg;

    } catch (err) {
        console.error('Error in saveUser:', err);
        let msg = {
            status: false,
            message: 'Error en el servidor',
            code: 500,
            error: err
        };
        return msg;
    }
};

module.exports = {
    getUser,
    saveUser
};
