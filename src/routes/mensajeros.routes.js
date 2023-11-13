import {Router} from 'express'
import pool from '../database.js'

const router = Router();

router.get("/add", (req, res)=>{
    res.render('mensajeros/add');
})

router.get('/list', async(req, res)=>{
    try{
        const [result] = await pool.query("SELECT * FROM mensajero");
        res.render('mensajeros/list', {mensajeros: result});
        //console.log(result);
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

router.post ('/add', async(req, res)=>{
    try{
        const {nombre, identificacion, telefono, edad, municipio} = req.body;
        const newMensajero = {
            nombre, identificacion, telefono, edad, municipio
        }
        await pool.query('INSERT INTO mensajero SET ?', [newMensajero]);
        res.redirect('/list');
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get('/edit/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const [mensajero] = await pool.query('SELECT * FROM mensajero WHERE id = ?', [id]);
        const mensajeroEdit = mensajero[0];
        res.render('mensajeros/edit', {mensajero: mensajeroEdit});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

router.post('/edit/:id', async(req, res)=>{
    try{
        const {nombre, identificacion, telefono, edad, municipio} = req.body;
        const {id} = req.params;
        const editMensajero = {nombre, identificacion, telefono, edad, municipio}
        await pool.query('UPDATE mensajero SET ? WHERE id = ?', [editMensajero, id]);
        res.redirect('/list')
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

router.get('/delete/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        await pool.query('DELETE FROM mensajero WHERE id = ?', [id]);
        res.redirect('/list');
    }catch(err){
        res.status(500).json({message:err.message});
    }
})
export default router;
