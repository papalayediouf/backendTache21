const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/baseDeDonnees');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const cors = require('cors');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const swaggerDocument = yaml.load('./docs/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log('Documentation disponible sur : http://localhost:5000/api-docs');

// Routes
const utilisateurRoutes = require('./routes/routesUtilisateurs');
const serviceRoutes = require('./routes/routesServices');
const motDePasseRoutes = require('./routes/routesMotDePasse'); 
const adminRoutes = require('./routes/routesAdministrateur'); 
const routePrivees = require('./routes/routePrivees'); 

// Définition des routes principales
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/mot-de-passe', motDePasseRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/privees', routePrivees);

// Gestion des erreurs 404 (route non trouvée)//
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ressource non trouvée.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// Port et lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
);
//