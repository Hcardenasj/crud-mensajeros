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

//Ruta para que me ELIMINE a un mensajero especificio

router.get('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM mensajero WHERE id = ?', [id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//Ruta para que me permita añadir un servicio a un mensajero especifico

router.get("/addServ/:id", (req, res) => {
    try {
        const {id} = req.params;
        res.render('mensajeros/addServ', {mensajeroId: id});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//Ruta para enviar los datos de un servicio para un mensajero especifico

router.post('/addServ/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, fecha } = req.body;
        const newServicio = {
            descripcion, fecha, mensajero_id:id,
        };
        await pool.query('INSERT INTO servicios SET ?', [newServicio]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Ruta para mostrar los servicios de un mensajero especifico

router.get("/listServ/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Obtener los servicios del mensajero con el id especificado
        const [servicios] = await pool.query('SELECT * FROM servicios WHERE mensajero_id = ?', [id]);
        console.log(servicios); // Verifica si obtienes datos aquí

        if (servicios.length === 0) {
            
            return res.redirect(`/addServ/${id}`);
        }

        res.render('mensajeros/listServ', { servicios });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

//Ruta para que me muestre la pantalla de edicion de un servicio

//Ruta para que me envie los datos de la edicion

//Ruta para eliminar un servicio asociado

// Ruta para que me muestre la pantalla de login

router.get("/login", (req, res) => {
    res.render('mensajeros/login')
})

export default router;

