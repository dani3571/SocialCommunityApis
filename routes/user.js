const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const prisma = new PrismaClient()
const router = express.Router()


/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/user', async(req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error interno del servidor');
    }
})
/**
 * @swagger
 * /users-with-profiles:
 *   get:
 *     summary: Obtiene todos los usuarios con sus perfiles
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: OK
 */
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
/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_user:
 *                 type: string
 *               email_user:
 *                 type: string
 *               password_user:
 *                 type: string
 *               profile:
 *                 type: object
 *                 properties:
 *                   name_profile:
 *                     type: string
 *                   day_birth_profile:
 *                     type: string
 *                   gender_profile:
 *                     type: string
 *                   id_country:
 *                     type: integer
 *                   image_profile:
 *                     type: string
 *                   image_header_profile:
 *                     type: string
 *                   description_profile:
 *                     type: string
 *                   phone_profile:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 */
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
/**
 * @swagger
 * /user/update/{userId}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_user:
 *                 type: string
 *               password_user:
 *                 type: string
 *               profile:
 *                 type: object
 *                 properties:
 *                   name_profile:
 *                     type: string
 *                   day_birth_profile:
 *                     type: string
 *                   gender_profile:
 *                     type: string
 *                   id_country:
 *                     type: integer
 *                   image_profile:
 *                     type: string
 *                   image_header_profile:
 *                     type: string
 *                   description_profile:
 *                     type: string
 *                   phone_profile:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 */
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


/**
 * @swagger
 * /user/inactive/{id}:
 *   put:
 *     summary: Desactiva un usuario
 *     tags: [Usuarios]
 *     
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a desactivar
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente
 */
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

/**
 * @swagger
 * /user/activate_user/{id}:
 *   put:
 *     summary: Activa un usuario desactivado
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a activar
 *     responses:
 *       200:
 *         description: Usuario activado exitosamente
 */
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

/**
 * @swagger
 * /login:
 * 
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_user:
 *                 type: string
 *               password_user:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión iniciada exitosamente
 */

router.post('/login', async (req, res) => {
    const { email_user, password_user } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: { email_user }
        });

        if (!user || !(await bcrypt.compare(password_user, user.password_user))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const username = await prisma.user.findUnique({
            where: { id_user: user.id_user },
            select: { name_user: true }
        });


        // Generar token JWT
        const token = jwt.sign({ userId: user.id_user, email_user: user.email_user, password_user: user.password_user,  name_user: username.name_user}, 'XJWSwsqbRmou4y2p6jNmwSLBuGJG3Gjz', { expiresIn: '1h' }); 


        res.json({ token, username, email_user, password_user});
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error interno del servidor');
    }
});
 
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Cierra sesión de usuario
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
router.post('/logout', async (req, res) => {
   
    res.clearCookie('token').json({ message: 'Logout exitoso' });
});


/**
 * @swagger
 * /decode-token:
 *   get:
 *     summary: Decodificar un token JWT
 *     description: Decodifica un token JWT y devuelve la información decodificada.
 *     parameters:
 *       - name: token
 *         in: query
 *         description: Token JWT a decodificar.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Información del token decodificado.
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: integer
 *               description: ID del usuario.
 *             email_user:
 *               type: string
 *               description: Email del usuario.
 *             password_user:
 *               type: string
 *               description: Contraseña del usuario.
 *       401:
 *         description: Token inválido.
 */
router.get('/decode-token', (req, res) => {
    const token = req.query.token; // Obtenemos el token de la consulta
    const secretKey = 'secreta';

    if (!token) {
        res.status(401).json({ error: 'Falta el token en la consulta' });
        return;
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Error al decodificar el token:', err);
            res.status(401).json({ error: 'Token inválido' });
        } else {
            const { userId, email_user, password_user, name_user } = decoded;
            res.json(decoded);
        }
    });
});

/*
router.get('/decode-token', (req, res) => {
    // Obtenemos el token de la solicitud (podría ser desde el header, query params, etc.)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Falta el encabezado de autorización' });
        return;
    }

    const token = authHeader.split(' ')[1];
    const secretKey = 'secreta';
    // Decodificar el token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Error al decodificar el token:', err);
            res.status(401).json({ error: 'Token inválido' });
        } else {
            // El token es válido y ha sido decodificado con éxito
            console.log('Información del token decodificado:', decoded);
            // Accede a la información del token como un objeto
            const { userId, email_user, password_user } = decoded;
            console.log('ID de usuario:', userId);
            console.log('Email de usuario:', email_user);
            console.log('Contraseña de usuario:', password_user);

            res.json(decoded); // Enviamos la información decodificada como respuesta
        }
    });
});
*/

module.exports = router; 