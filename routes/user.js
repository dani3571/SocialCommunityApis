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
router.get('/users-with-profiles', async (req, res) => {
    try {
        const usersWithProfiles = await prisma.user.findMany({
            include: { profile: true }
        });

        res.json(usersWithProfiles);
    } catch (error) {
        console.error('Error al obtener usuarios con perfiles:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/user/create', async(req, res) => {
    try {
        const { name_user, email_user, password_user, profile } = req.body;
        
        const existingUser = await prisma.user.findFirst({
            where: {
                email_user
            }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe.' });
        }

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
        await prisma.profile.create({
            data:{
              user: {
                connect: {id_user: user_create.id_user}
              },
              name_profile: user_create.name_user,
              day_birth_profile: new Date(),
              description_profile: '',
              gender_profile: '',
              country: { 
                connect: { id_country: 1 } 
              },
              image_header_profile: '',
              image_profile: '',
              phone_profile: 77777777,
              updated_profile: new Date()
            }
        })
        res.json(user_create);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
})

router.put('/user/update/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { 
            name_user,  
            password_user, 
            profile 
        } = req.body;

        const { 
            name_profile, 
            day_birth_profile, 
            gender_profile, 
            id_country, 
            image_profile, 
            image_header_profile, 
            description_profile, 
            phone_profile 
        } = profile.update;

        const userProfile = await prisma.profile.findFirst({
            where: {
                id_user: userId
            }
        });
        if (!userProfile) {
            return res.status(404).json({ error: 'No se encontró el perfil asociado a este usuario.' });
        }
        const userProfileId = userProfile.id_profile
        
      
        const updateData = {
            name_user,
            password_user :  await bcrypt.hash(password_user, 10),
            rol: { 
                connect: { id_rol: 1 } // id_rol = User
            },
            profile: {
                update: {
                    where: {id_profile: userProfileId  }, 
                    data: {
                        name_profile,
                        day_birth_profile,
                        gender_profile,
                        id_country,
                        image_profile,
                        image_header_profile,
                        description_profile,
                        phone_profile,
                        updated_profile: new Date()
                    }
                }
            }
        };

        const userUpdate = await prisma.user.update({
            where: { id_user: userId }, 
            data: updateData,
            include: {
                profile: true
            }
        });

        res.json(userUpdate); 
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