import { Router } from 'express'
import pool from '../database.js'

const router = Router();


//Ruta para que me muestre la creacion de un mensajero

router.get("/add", (req, res) => {
    res.render('mensajeros/add');
})

//Ruta para que me muestre la lista de los mensajeros

router.get('/list', async (req, res) => {
    try {
        const [result] = await pool.query("SELECT * FROM mensajero");
        res.render('mensajeros/list', { mensajeros: result });
        //console.log(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//Ruta para que me envíe los datos de un mensajero

router.post('/add', async (req, res) => {
    try {
        const { nombre, identificacion, telefono, edad, municipio } = req.body;
        const newMensajero = {
            nombre, identificacion, telefono, edad, municipio
        }
        await pool.query('INSERT INTO mensajero SET ?', [newMensajero]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//Ruta para que me muestre la edición de un mensajero especificio

router.get('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [mensajero] = await pool.query('SELECT * FROM mensajero WHERE id = ?', [id]);
        const mensajeroEdit = mensajero[0];
        res.render('mensajeros/edit', { mensajero: mensajeroEdit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//Ruta para que me envie los datos de la la edición de un mensajero especificio

router.post('/edit/:id', async (req, res) => {
    try {
        const { nombre, identificacion, telefono, edad, municipio } = req.body;
        const { id } = req.params;
        const editMensajero = { nombre, identificacion, telefono, edad, municipio }
        await pool.query('UPDATE mensajero SET ? WHERE id = ?', [editMensajero, id]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// En tu archivo de rutas (mensajeros.routes.js u otro)
//Render de error de eliminacion
router.get('/error-page', (req, res) => {
    res.render('error/error-page'); // Reemplaza 'error-page' con el nombre de tu vista de error
});
//Render de error de correo
router.get('/error-correo', (req, res) => {
    res.render('error/error-correo'); // Reemplaza 'error-page' con el nombre de tu vista de error
});

router.get('/error-password', (req, res) => {
    res.render('error/error-password'); // Reemplaza 'error-page' con el nombre de tu vista de error
});

//Ruta para que me ELIMINE a un mensajero especificio

router.get('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Intentar eliminar el mensajero
        await pool.query('DELETE FROM mensajero WHERE id = ?', [id]);

        // Si llegamos aquí, significa que se eliminó el mensajero correctamente
        res.redirect('/list');
    } catch (err) {
        // Manejar el caso específico de servicios asociados
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.redirect('/error-page');
            //return res.status(400).json({ message: 'No se puede eliminar el mensajero porque tiene servicios asociados.' });
        }

        // Otros errores
        res.status(500).json({ message: 'Hubo un error al procesar la solicitud.', error: err.message });
    }
});

//Ruta para que me permita añadir un servicio a un mensajero especifico

router.get("/addServ/:id", async (req, res) => {
    try {
        const { id } = req.params;
        res.render('mensajeros/addServ', { mensajeroId: id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para enviar los datos de un servicio para un mensajero específico
router.post('/addServ/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, fecha, valor, dir_recog, mun_recog, dir_entrega, mun_entrega, cliente_id } = req.body;

        // Asegúrate de que cliente_id esté presente en req.body
        if (!cliente_id) {
            return res.status(400).json({ message: 'cliente_id is required' });

        }

        // Paso 1: Obtener la ganancia actual del mensajero
        const [gananciaResult] = await pool.query('SELECT ganancia FROM mensajero WHERE id = ?', [id]);
        const gananciaActual = gananciaResult[0].ganancia;

        // Paso 2: Calcular el 70% del valor del servicio y actualizar la ganancia
        const valorServicio = parseFloat(valor);
        const porcentajeGanancia = 0.7;
        const gananciaNueva = gananciaActual + (valorServicio * porcentajeGanancia);

        // Paso 3: Actualizar la base de datos con la nueva ganancia del mensajero
        await pool.query('UPDATE mensajero SET ganancia = ? WHERE id = ?', [gananciaNueva, id]);

        // Insertar el nuevo servicio en la base de datos
        const newServicio = {
            descripcion, fecha, valor, dir_recog, mun_recog, dir_entrega, mun_entrega, mensajero_id: id, cliente_id,
        };
        await pool.query('INSERT INTO servicios SET ?', [newServicio]);
        res.redirect('/list'); // Corregí la redirección a la ruta correcta
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Ruta para mostrar los servicios de un mensajero especifico

router.get("/listServ/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Obtener los servicios del mensajero con el id especificado, incluyendo la información del cliente
        const query = `
            SELECT servicios.*, cliente.nombre AS nombre_cliente
            FROM servicios
            INNER JOIN cliente ON servicios.cliente_id = cliente.id
            WHERE servicios.mensajero_id = ?`;
        const [servicios] = await pool.query(query, [id]);

        servicios.forEach((servicio) => {
            servicio.fecha = formatDate(servicio.fecha);
        });

        console.log(servicios); // Verifica si obtienes datos aquí

        res.render('mensajeros/listServ', { servicios });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
// Función para formatear la fecha en 'YYYY/MM/DD'
function formatDate(date) {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
}

router.get('/editServ/:mensajeroId/:servicioId', async (req, res) => {
    try {
        const { mensajeroId, servicioId } = req.params;
        const [servicio] = await pool.query('SELECT * FROM servicios WHERE id = ? AND mensajero_id = ?', [servicioId, mensajeroId]);

        // Asegúrate de que obtuviste un servicio antes de renderizar la página
        if (servicio.length === 0) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        const servicioEdit = servicio[0];

        servicioEdit.fecha = formatDate(servicioEdit.fecha);

        res.render('mensajeros/editServ', { servicio: servicioEdit, mensajeroId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para enviar los datos de la edición del servicio
router.post('/editServ/:mensajeroId/:servicioId', async (req, res) => {
    try {
        const { mensajeroId, servicioId } = req.params;
        const { descripcion, fecha, valor, dir_recog, mun_recog, dir_entrega, mun_entrega, mensajeroId: formularioMensajeroId } = req.body;

        // Verificar que el mensajeroId del formulario coincide con el de la URL
        if (mensajeroId !== formularioMensajeroId) {
            return res.status(400).json({ message: 'Error: ID del mensajero no coincide.' });
        }

        // Verificar la existencia del servicio antes de actualizar
        const [existingService] = await pool.query('SELECT * FROM servicios WHERE id = ? AND mensajero_id = ?', [servicioId, mensajeroId]);

        if (existingService.length === 0) {
            return res.sendStatus(404);
        }

        const existingValor = existingService[0].valor;

        const editServicio = {
            descripcion,
            fecha: new Date(fecha).toISOString().slice(0, 19).replace('T', ' '),
            valor,
            dir_recog,
            mun_recog,
            dir_entrega,
            mun_entrega
        };

        // Actualizar el servicio en la base de datos
        await pool.query('UPDATE mensajero.servicios SET ? WHERE id = ? AND mensajero_id = ?', [editServicio, servicioId, mensajeroId]);

        // Calcular la diferencia en el valor del servicio
        const diferenciaValor = valor - existingValor;

        // Calcular el 70% de la diferencia y actualizar la ganancia del mensajero
        const gananciaMensajero = 0.7 * diferenciaValor;
        await pool.query('UPDATE mensajero SET ganancia = ganancia + ? WHERE id = ?', [gananciaMensajero, mensajeroId]);

        console.log('Datos del formulario:', req.body); // Agrega este log para verificar

        // Redirigir a la página listServ después de la actualización
        res.redirect(`/listServ/${mensajeroId}`);
    } catch (err) {
        console.error('Error al actualizar el servicio:', err);
        res.status(500).json({ message: 'Hubo un error al procesar la solicitud.', error: err.message });
    }
});

//Ruta para eliminar un servicio asociado

router.get('/delete/:mensajeroId/:servicioId', async (req, res) => {
    try {
        const { mensajeroId, servicioId } = req.params;

        // Paso 1: Obtener el valor del servicio a eliminar
        const [servicioResult] = await pool.query('SELECT valor FROM servicios WHERE mensajero_id = ? AND id = ?', [mensajeroId, servicioId]);
        const valorServicio = servicioResult[0].valor;

        // Eliminar el servicio
        await pool.query('DELETE FROM servicios WHERE mensajero_id = ? AND id = ?', [mensajeroId, servicioId]);

        // Paso 2: Calcular el 70% del valor del servicio y restar este valor a la ganancia del mensajero
        const porcentajeGanancia = 0.7;
        const gananciaRestar = valorServicio * porcentajeGanancia;

        // Obtener la ganancia actual del mensajero
        const [gananciaResult] = await pool.query('SELECT ganancia FROM mensajero WHERE id = ?', [mensajeroId]);
        const gananciaActual = gananciaResult[0].ganancia;

        const gananciaNueva = gananciaActual - gananciaRestar;

        // Paso 3: Actualizar la base de datos con la nueva ganancia del mensajero
        await pool.query('UPDATE mensajero SET ganancia = ? WHERE id = ?', [gananciaNueva, mensajeroId]);

        // Obtener la lista actualizada de servicios
        const [servicios] = await pool.query('SELECT * FROM servicios WHERE mensajero_id = ?', [mensajeroId]);

        // Renderizar la misma página con los servicios actualizados
        res.render('mensajeros/listServ', { servicios });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para que me muestre la pantalla de login

router.get("/login", (req, res) => {
    res.render('login/login')
})

// Ruta para el envio de datos del login

router.post("/login", async (req, res) => {
    try {
        const data = req.body;

        const connection = await pool.getConnection();
        const [userdata] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [data.email]);

        connection.release();

        if (userdata.length > 0) {
            const user = userdata[0];

            // Realiza la lógica de verificación de contraseña sin bcrypt
            if (data.password === user.password) {
                // Usuario autenticado correctamente
                console.log("Usuario autenticado correctamente");

                // Redirige a la ruta "/add" después de la autenticación exitosa
                return res.redirect("welcome-user")

            } else {
                // Contraseña incorrecta
                console.log("CONTRASEÑA INCORRECTA");
                return res.redirect("error-password")
            }
        } else {
            // Usuario no encontrado
            console.log("USUARIO NO ENCONTRADO");
            //res.render("index", { error: "Error: Usuario no encontrado" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Mensaje de Bienvenida
router.get('/welcome-user', (req, res) => {
    res.render('welcome/welcome-user'); // Reemplaza 'error-page' con el nombre de tu vista de error
});

//Ruta para que muestre la pantalla de register

router.get("/register", (req, res) => {
    res.render('login/register')
})

// En tu archivo de rutas (mensajeros.routes.js u otro)
router.get('/welcome-page', (req, res) => {
    res.render('welcome/welcome-page'); // Reemplaza 'error-page' con el nombre de tu vista de error
});

router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validación de los datos recibidos
        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,6}$/)) {
            return res.status(400).json({ message: "El correo electrónico no es válido" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }

        // Verificar si el correo electrónico ya está registrado

        // Si el correo electrónico no está registrado, proceder con la inserción
        const newUser = {
            nombre, email, password
        };

        await pool.query('INSERT INTO usuarios SET ?', [newUser]);
        return res.redirect("welcome-page")


    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.redirect('/error-correo');
            //return res.status(400).json({ message: 'Correo electrónico duplicado. No se puede insertar el registro.' });
        } else {
            return res.status(500).json({ message: err.message });
        }
        //res.status(500).json({ message: err.message });
    }
});

// Ruta para mostrar la lista de clientes con nivel de fidelidad
router.get('/listCli', async (req, res) => {
    try {
        // Paso 1: Obtener la cantidad total de servicios
        const [totalServiciosResult] = await pool.query('SELECT COUNT(id) AS total_servicios FROM servicios');
        const totalServicios = totalServiciosResult[0].total_servicios || 1; // Evitar división por cero

        // Paso 2: Obtener la lista de clientes y la cantidad de servicios asociados a cada uno
        const query = `
            SELECT cliente.*, COUNT(servicios.id) AS cantidad_servicios
            FROM cliente
            LEFT JOIN servicios ON cliente.id = servicios.cliente_id
            GROUP BY cliente.id, cliente.nombre, cliente.identificacion, cliente.telefono, cliente.direccion, cliente.muncipio
        `;
        const [clientes] = await pool.query(query);

        // Paso 3: Calcular el nivel de fidelidad porcentual para cada cliente
        clientes.forEach((cliente) => {
            const cantidadServicios = cliente.cantidad_servicios || 0; // Evitar división por cero
            cliente.nivel_fidelidad = ((cantidadServicios / totalServicios) * 100).toFixed(2);
        });

        // Paso 4: Pasar esta información a la plantilla
        res.render('clientes/listCli', { mensajeros: clientes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;

