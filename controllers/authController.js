// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// // Inscription
// const registerUser = async (req, res) => {
//     const { nom, email, mot_de_passe } = req.body;
//     try {
//         const userExiste = await User.findOne({ email });
//         if (userExiste) return res.status(400).json({ message: 'Email déjà utilisé' });

//         const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
//         const user = new User({ nom, email, mot_de_passe: hashedPassword });
//         await user.save();

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
//         res.status(201).json({ message: 'Utilisateur créé avec succès', token });
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de la création', error: err.message });
//     }
// };

// // Connexion
// const loginUser = async (req, res) => {
//     const { email, mot_de_passe } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user || !(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
//             return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
//         res.status(200).json({ message: 'Connexion réussie', token });
//     } catch (err) {
//         res.status(500).json({ message: 'Erreur lors de la connexion', error: err.message });
//     }
// };

// module.exports = { registerUser, loginUser };
