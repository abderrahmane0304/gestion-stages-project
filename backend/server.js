// CONFIGURATION BACKEND EXPRESS.JS

// 1. CONFIGURATION DE L'APPLICATION

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// 2. CONNEXION À LA BASE DE DONNÉES (SEQUELIZE)

const Sequelize = require('sequelize');

const sequelize = new Sequelize('gestion_stages', 'root', 'Nadia@2003', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Mettre true pour voir les requêtes SQL
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 3. MODÈLES SEQUELIZE

// Modèle User
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM('etudiant', 'admin'),
    defaultValue: 'etudiant'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'date_creation',
  updatedAt: false
});

// Modèle Stage
const Stage = sequelize.define('Stage', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_etudiant: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  entreprise: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  sujet: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  date_debut: {
    type: Sequelize.DATE,
    allowNull: false
  },
  date_fin: {
    type: Sequelize.DATE,
    allowNull: false
  },
  statut: {
    type: Sequelize.ENUM('en_attente', 'valide', 'refuse'),
    defaultValue: 'en_attente'
  },
  commentaire_admin: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'stages',
  timestamps: true,
  createdAt: 'date_creation',
  updatedAt: 'date_modification'
});

// Associations
User.hasMany(Stage, { foreignKey: 'id_etudiant' });
Stage.belongsTo(User, { foreignKey: 'id_etudiant' });

// 4. CONTROLLERS - LOGIQUE MÉTIER

// ========== CONTROLLER USERS ==========

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [{
        model: Stage,
        attributes: ['id', 'entreprise', 'sujet', 'date_debut', 'date_fin', 'statut']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ========== CONTROLLER STAGES ==========

const createStage = async (req, res) => {
  try {
    const { id_etudiant, entreprise, sujet, description, date_debut, date_fin } = req.body;

    // Validation
    if (!id_etudiant || !entreprise || !sujet || !date_debut || !date_fin) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    // Vérifier que la date fin est après la date début
    if (new Date(date_fin) <= new Date(date_debut)) {
      return res.status(400).json({ message: 'La date de fin doit être après la date de début' });
    }

    // Vérifier que l'étudiant existe
    const user = await User.findByPk(id_etudiant);
    if (!user || user.role !== 'etudiant') {
      return res.status(404).json({ message: 'Utilisateur ou étudiant non trouvé' });
    }

    const stage = await Stage.create({
      id_etudiant,
      entreprise,
      sujet,
      description,
      date_debut,
      date_fin,
      statut: 'en_attente'
    });

    res.status(201).json({ message: 'Stage déclaré avec succès', stage });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getAllStages = async (req, res) => {
  try {
    const { statut, id_etudiant } = req.query;
    const where = {};

    if (statut) where.statut = statut;
    if (id_etudiant) where.id_etudiant = id_etudiant;

    const stages = await Stage.findAll({
      where,
      include: [{
        model: User,
        attributes: ['id', 'nom', 'email']
      }],
      order: [['date_creation', 'DESC']]
    });

    res.json(stages);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getStageById = async (req, res) => {
  try {
    const { id } = req.params;
    const stage = await Stage.findByPk(id, {
      include: [{
        model: User,
        attributes: ['nom', 'email']
      }]
    });

    if (!stage) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }

    res.json(stage);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { entreprise, sujet, description, date_debut, date_fin } = req.body;

    const stage = await Stage.findByPk(id);
    if (!stage) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }

    if (stage.statut !== 'en_attente') {
      return res.status(400).json({ message: 'Impossible de modifier un stage validé ou refusé' });
    }

    if (date_fin && date_debut && new Date(date_fin) <= new Date(date_debut)) {
      return res.status(400).json({ message: 'La date de fin doit être après la date de début' });
    }

    await stage.update({
      entreprise: entreprise || stage.entreprise,
      sujet: sujet || stage.sujet,
      description: description !== undefined ? description : stage.description,
      date_debut: date_debut || stage.date_debut,
      date_fin: date_fin || stage.date_fin
    });

    res.json({ message: 'Stage modifié avec succès', stage });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteStage = async (req, res) => {
  try {
    const { id } = req.params;
    const stage = await Stage.findByPk(id);

    if (!stage) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }

    if (stage.statut !== 'en_attente') {
      return res.status(400).json({ message: 'Impossible de supprimer un stage validé ou refusé' });
    }

    await stage.destroy();
    res.json({ message: 'Stage supprimé avec succès' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const validerStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentaire_admin } = req.body;

    const stage = await Stage.findByPk(id);
    if (!stage) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }

    if (stage.statut !== 'en_attente') {
      return res.status(400).json({ message: 'Stage déjà traité' });
    }

    await stage.update({
      statut: 'valide',
      commentaire_admin: commentaire_admin || null
    });

    res.json({ message: 'Stage validé avec succès', stage });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const refuserStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentaire_admin } = req.body;

    if (!commentaire_admin || commentaire_admin.trim() === '') {
      return res.status(400).json({ message: 'Un commentaire est obligatoire pour refuser un stage' });
    }

    const stage = await Stage.findByPk(id);
    if (!stage) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }

    if (stage.statut !== 'en_attente') {
      return res.status(400).json({ message: 'Stage déjà traité' });
    }

    await stage.update({
      statut: 'refuse',
      commentaire_admin
    });

    res.json({ message: 'Stage refusé', stage });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getStatistiques = async (req, res) => {
  try {
    const total = await Stage.count();
    const validees = await Stage.count({ where: { statut: 'valide' } });
    const en_attente = await Stage.count({ where: { statut: 'en_attente' } });
    const refusees = await Stage.count({ where: { statut: 'refuse' } });

    res.json({
      total,
      validees,
      en_attente,
      refusees
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 5. ROUTES API

// Routes Users
app.get('/api/users', getAllUsers);
app.get('/api/users/:id', getUserById);

// Routes Stages
app.get('/api/stages', getAllStages);
app.post('/api/stages', createStage);
app.get('/api/stages/:id', getStageById);
app.put('/api/stages/:id', updateStage);
app.delete('/api/stages/:id', deleteStage);
app.patch('/api/stages/:id/valider', validerStage);
app.patch('/api/stages/:id/refuser', refuserStage);

// Route Statistiques
app.get('/api/statistiques', getStatistiques);

// 6. DÉMARRAGE DU SERVEUR

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📊 Base de données connectée: gestion_stages`);
  });
}).catch(error => {
  console.error('❌ Erreur de connexion à la base de données:', error);
  process.exit(1);
});

module.exports = app;
