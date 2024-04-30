const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
const router = express.Router()

router.get('/user', async(req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error interno del servidor');
    }
})

router.post('/user/create', async(req, res) => {
    try {
        const { name_user, email_user, password_user, active_user, created_user, id_rol } = req.body
        const user_create = await prisma.user.create({
            data: {
                name_user,
                email_user,
                password_user,
                active_user : true,
                created_user: new Date(), 
                rol: { // Aquí proporcionas la información del rol
                    connect: { id_rol: 1 } // Aquí especificas el rol al que pertenece el usuario (por ejemplo, el rol con id_rol = 1)
                },
                profile: { // Aquí proporcionas la información del rol
                    connect: { id_profile: 1 } // Aquí especificas el rol al que pertenece el usuario (por ejemplo, el rol con id_rol = 1)
                }
              },
        });
        res.json(user_create);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
})

router.put('/user/update/:id', async(req, res) => {
    const userId = parseInt(req.params.id); // Obtener el ID del usuario de los parámetros de la URL
    const { name_user, email_user, password_user, active_user, created_user, id_rol } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id_user: userId }
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const updatedUser = await prisma.user.update({
            where: { id_user: userId },
            data: {
                name_user,
                password_user,
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/user/inactive/:id', async(req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id_user: userId }
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const updatedUser = await prisma.user.update({
            where: { id_user: userId },
            data: {
                active_user: false
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});




// Exporta el enrutador
module.exports = router;