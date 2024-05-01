const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


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
        const hashedPassword = await bcrypt.hash(password_user,10)
        const user_create = await prisma.user.create({
            data: {
                name_user,
                email_user,
                password_user: hashedPassword,
                active_user : true,
                created_user: new Date(), 
                rol: { 
                    connect: { id_rol: 1 } 
                },
              },
        });
        res.json(user_create);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
})

router.put('/user/update/:id', async(req, res) => {
    const userId = parseInt(req.params.id);
    const { name_user, email_user, password_user, active_user, created_user, id_rol } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id_user: userId }
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const dataToUpdate = {
            name_user,
        };

        if (password_user) {
            dataToUpdate.password_user =  await bcrypt.hash(password_user, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id_user: userId },
            data: dataToUpdate
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
router.put('/user/activate_user/:id', async(req, res) => {
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
                active_user: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.post('/login', async (req, res) => {
    const { email_user, password_user } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: { email_user }
        });

        if (!user || !(await bcrypt.compare(password_user, user.password_user))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Genera JWT
        const token = jwt.sign({ userId: user.id_user }, 'secreto', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.post('/logout', async (req, res) => {
   
    res.clearCookie('token').json({ message: 'Logout exitoso' });
});

module.exports = router;

// Exporta el enrutador
module.exports = router;