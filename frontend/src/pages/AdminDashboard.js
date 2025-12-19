import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ValidationCard from '../components/ValidationCard';
import stageService from '../services/stageService';
import '../styles/AdminDashboard.css';

function AdminDashboard({ userId, onLogout }) {
  const navigate = useNavigate();
  const [stages, setStages] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState('all');
  const [statistiques, setStatistiques] = useState({
    total: 0,
    validees: 0,
    en_attente: 0,
    refusees: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    fetchData();
  }, [userId, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stagesData, statsData] = await Promise.all([
        stageService.getAll(),
        stageService.getStatistiques()
      ]);
      setStages(stagesData);
      setStatistiques(statsData);
    } catch (error) {
      showMessage('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleValider = async (id, commentaire) => {
    try {
      await stageService.valider(id, commentaire);
      fetchData();
      showMessage('Stage validé avec succès', 'success');
    } catch (error) {
      showMessage('Erreur lors de la validation', 'error');
    }
  };

  const handleRefuser = async (id, commentaire) => {
    try {
      await stageService.refuser(id, commentaire);
      fetchData();
      showMessage('Stage refusé', 'success');
    } catch (error) {
      showMessage('Erreur lors du refus', 'error');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const stagesFiltrés = filtreStatut === 'all'
    ? stages
    : stages.filter(s => s.statut === filtreStatut);

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🔧 Gestion des Stages</h1>
          <p>Validez et refusez les déclarations d'étudiants</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">
          Déconnexion
        </button>
      </header>

      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      <div className="dashboard-content">
        <div className="statistics">
          <div className="stat-card">
            <h3>Total</h3>
            <p className="stat-number">{statistiques.total}</p>
          </div>
          <div className="stat-card stat-en-attente">
            <h3>En Attente</h3>
            <p className="stat-number">{statistiques.en_attente}</p>
          </div>
          <div className="stat-card stat-valide">
            <h3>Validés</h3>
            <p className="stat-number">{statistiques.validees}</p>
          </div>
          <div className="stat-card stat-refuse">
            <h3>Refusés</h3>
            <p className="stat-number">{statistiques.refusees}</p>
          </div>
        </div>

        <div className="filters">
          <label>Filtrer par statut:</label>
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="form-control"
          >
            <option value="all">Tous</option>
            <option value="en_attente">En Attente</option>
            <option value="valide">Validés</option>
            <option value="refuse">Refusés</option>
          </select>
        </div>

        {loading ? (
          <p className="loading">Chargement...</p>
        ) : stagesFiltrés.length === 0 ? (
          <div className="empty-state">
            <p>Aucun stage à afficher</p>
          </div>
        ) : (
          <div className="validations-list">
            {stagesFiltrés.map(stage => (
              <ValidationCard
                key={stage.id}
                stage={stage}
                onValider={handleValider}
                onRefuser={handleRefuser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
