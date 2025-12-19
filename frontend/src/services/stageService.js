// ================================================================================
// SERVICE API - Communication avec le Backend
// ================================================================================
// Fichier: services/stageService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Gestion des erreurs globale
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.message || 'Erreur réseau';
    return Promise.reject(new Error(message));
  }
);

const stageService = {
  // ===== OPÉRATIONS SUR LES STAGES =====
  
  // Récupérer tous les stages
  getAll: async () => {
    try {
      return await api.get('/stages');
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un stage par ID
  getById: async (id) => {
    try {
      return await api.get(`/stages/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les stages d'un étudiant
  getByEtudiant: async (id_etudiant) => {
    try {
      return await api.get('/stages', {
        params: { id_etudiant }
      });
    } catch (error) {
      throw error;
    }
  },

  // Créer un nouveau stage
  create: async (stageData) => {
    try {
      return await api.post('/stages', stageData);
    } catch (error) {
      throw error;
    }
  },

  // Modifier un stage
  update: async (id, stageData) => {
    try {
      return await api.put(`/stages/${id}`, stageData);
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un stage
  delete: async (id) => {
    try {
      return await api.delete(`/stages/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Valider un stage
  valider: async (id, commentaire_admin = '') => {
    try {
      return await api.patch(`/stages/${id}/valider`, {
        commentaire_admin
      });
    } catch (error) {
      throw error;
    }
  },

  // Refuser un stage
  refuser: async (id, commentaire_admin) => {
    try {
      return await api.patch(`/stages/${id}/refuser`, {
        commentaire_admin
      });
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les statistiques
  getStatistiques: async () => {
    try {
      return await api.get('/statistiques');
    } catch (error) {
      throw error;
    }
  },

  // ===== OPÉRATIONS SUR LES UTILISATEURS =====

  // Récupérer tous les utilisateurs
  getAllUsers: async () => {
    try {
      return await api.get('/users');
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    try {
      return await api.get(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default stageService;

