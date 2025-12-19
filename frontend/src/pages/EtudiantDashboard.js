import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeclarationForm from '../components/DeclarationForm';
import StatutBadge from '../components/StatutBadge';
import stageService from '../services/stageService';
import '../styles/EtudiantDashboard.css';

function EtudiantDashboard({ userId, onLogout }) {
  const navigate = useNavigate();
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    fetchStages();
  }, [userId, navigate]);

  const fetchStages = async () => {
    setLoading(true);
    try {
      const data = await stageService.getByEtudiant(userId);
      setStages(data);
    } catch (error) {
      showMessage('Erreur lors du chargement des stages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleStageCreated = (newStage) => {
    setStages([newStage, ...stages]);
    setShowForm(false);
    showMessage('Stage déclaré avec succès!', 'success');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous supprimer ce stage?')) {
      try {
        await stageService.delete(id);
        setStages(stages.filter(s => s.id !== id));
        showMessage('Stage supprimé avec succès', 'success');
      } catch (error) {
        showMessage('Erreur lors de la suppression', 'error');
      }
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="etudiant-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📚 Mes Stages</h1>
          <p>Déclarez et suivez vos stages</p>
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

      <main className="dashboard-content">
        <div className="actions-bar">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '❌ Annuler' : '➕ Déclarer un Stage'}
          </button>
        </div>

        {showForm && (
          <DeclarationForm
            userId={userId}
            onStageCreated={handleStageCreated}
          />
        )}

        {loading ? (
          <p className="loading">Chargement...</p>
        ) : stages.length === 0 ? (
          <div className="empty-state">
            <p>Vous n'avez pas encore déclaré de stage</p>
          </div>
        ) : (
          <div className="stages-list">
            {stages.map(stage => (
              <div key={stage.id} className="stage-card">
                <div className="stage-header">
                  <h3>{stage.entreprise}</h3>
                  <StatutBadge statut={stage.statut} />
                </div>

                <p className="stage-subject"><strong>{stage.sujet}</strong></p>

                <div className="stage-dates">
                  📅 {new Date(stage.date_debut).toLocaleDateString('fr-FR')} 
                  <span> → </span>
                  {new Date(stage.date_fin).toLocaleDateString('fr-FR')}
                </div>

                {stage.description && (
                  <p className="stage-description">{stage.description}</p>
                )}

                {stage.commentaire_admin && (
                  <div className="admin-comment">
                    <strong>💬 Commentaire Admin:</strong>
                    <p>{stage.commentaire_admin}</p>
                  </div>
                )}

                {stage.statut === 'en_attente' && (
                  <button
                    onClick={() => handleDelete(stage.id)}
                    className="btn btn-danger btn-small"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default EtudiantDashboard;
