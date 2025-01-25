const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/baseDeDonnees'); // Connexion à la base de données
const swaggerUi = require('swagger-ui-express'); // Swagger pour la documentation
const yaml = require('yamljs'); // Chargement des fichiers YAML
const cors = require('cors'); // Gestion des politiques CORS
const path = require('path'); // Gestion des chemins de fichiers

dotenv.config(); // Chargement des variables d'environnement

// Connexion à la base de données
connectDB();

const app = express();

// Middleware pour analyser les données JSON
app.use(express.json());

// Middleware pour autoriser les requêtes cross-origin (CORS)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Autoriser toutes les origines ou configurer une origine spécifique
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Middleware pour servir les fichiers statiques (exemple : fichiers téléchargés)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration de Swagger pour la documentation API
const swaggerDocument = yaml.load('./docs/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log('Documentation API disponible sur : http://localhost:5000/api-docs');

// Importation des routes
const utilisateurRoutes = require('./routes/routesUtilisateurs'); // Routes utilisateurs
const serviceRoutes = require('./routes/routesServices'); // Routes des services
const motDePasseRoutes = require('./routes/routesMotDePasse'); // Routes pour la gestion du mot de passe
const adminRoutes = require('./routes/routesAdministrateur'); // Routes pour les administrateurs
const routePrivees = require('./routes/routePrivees'); // Routes privées
const demandeServiceRoutes = require('./routes/routesDemandeService'); // Routes des demandes de services
const clientRoutes = require('./routes/routeClient'); // Routes pour les clients
const prestataireRoutes = require('./routes/routePrestataire'); // Routes pour les prestataires

// Définition des routes principales
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/mot-de-passe', motDePasseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/privees', routePrivees);
app.use('/api/demandes-services', demandeServiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/prestataires', prestataireRoutes);

// Middleware pour gérer les erreurs 404 (ressource non trouvée)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ressource non trouvée.' });
});

// Middleware global pour gérer les erreurs du serveur
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({
    message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// Définir le port et lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
