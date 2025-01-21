const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/baseDeDonnees');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const cors = require('cors')
const path = require("path");


// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(cors());

// Charger le fichier Swagger YAML
const swaggerDocument = yaml.load('./docs/swagger.yaml');

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log('http://localhost:5000/api-docs');


// Routes
const utilisateurRoutes = require('./routes/routesUtilisateurs');
const serviceRoutes = require('./routes/routesServices'); 
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/services', serviceRoutes);

//test



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
