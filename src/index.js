import express from "express";
import morgan from "morgan";
import { engine } from 'express-handlebars'; // Importa express-handlebars
import { join, dirname } from 'path';
import { fileURLToPath } from "url";
import mensajerosRoutes from './routes/mensajeros.routes.js';
//import { publicDecrypt } from "crypto";

// Inicialización
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración
app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({  // Utiliza exphbs para configurar el motor de plantillas
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev')); 
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.get("/", (req, res)=>{
    //res.json({"message": "Hola"});
    res.render("index")
})

app.use(mensajerosRoutes);

// Public files
app.use(express.static(join(__dirname, 'public')));



// Run Server
app.listen(app.get('port'), () =>
    console.log("Server listening on port", app.get('port')));
