const { getUser, saveUser } = require('../models/auth');

const controller = {};

controller.saveUser = async (req, res) => {
    try {
        const { cedula_rif, nombre, telefono, email, direccion, password } = req.body;
        console.log('Request body:', req.body);

        let user = await getUser({ cedula_rif });

        if (user.code === 200) {
            return res.status(500).json({ message: 'Aliado Already Registered', status: false, code: 500 });
        } else if (user.code === 404) {
            let result = await saveUser({ cedula_rif, nombre ,telefono, direccion, email, password });

            if (result.status) {
                return res.status(result.code).json(result);
            } else {
                return res.status(500).json(result);
            }
        }

    } catch (err) {
        console.error('Error saving Aliado:', err);
        res.status(500).json({ error: 'Error saving aliado' });
    }
};

module.exports = controller;
