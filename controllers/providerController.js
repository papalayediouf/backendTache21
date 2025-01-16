// const Provider = require('../models/providerModel');

// const getProviders = async (req, res) => {
//     try {
//         const providers = await Provider.find();
//         res.status(200).json(providers);
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de la récupération des prestataires', error: err.message });
//     }
// };

// const createProvider = async (req, res) => {
//     const { nom, email, service, description, tarif } = req.body;
//     try {
//         const provider = new Provider({ nom, email, service, description, tarif });
//         await provider.save();
//         res.status(201).json({ message: 'Prestataire créé avec succès', provider });
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de la création du prestataire', error: err.message });
//     }
// };

// module.exports = { getProviders, createProvider };
