import React, { useState } from 'react';
import StatutBadge from './StatutBadge';
import '../styles/ValidationCard.css';

function ValidationCard({ stage, onValider, onRefuser }) {
  const [showCommentaire, setShowCommentaire] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const [isRefusing, setIsRefusing] = useState(false);

  const handleValider = () => {
    onValider(stage.id, commentaire);
    setCommentaire('');
    setShowCommentaire(false);
  };

  const handleRefuser = () => {
    if (!commentaire.trim()) {
      alert('Un commentaire est obligatoire pour refuser');
      return;
    }
    onRefuser(stage.id, commentaire);
    setCommentaire('');
    setShowCommentaire(false);
    setIsRefusing(false);
  };

  if (stage.statut !== 'en_attente') {
    return (
      <div className="validation-card completed">
        <div className="card-header">
          <div>
            <h4>{stage.entreprise}</h4>
            <p>{stage.User?.nom} ({stage.User?.email})</p>
          </div>
          <StatutBadge statut={stage.statut} />
        </div>

        <p className="stage-subject">{stage.sujet}</p>

        <div className="stage-dates">
          📅 {new Date(stage.date_debut).toLocaleDateString('fr-FR')}
          <span> → </span>
          {new Date(stage.date_fin).toLocaleDateString('fr-FR')}
        </div>

        {stage.commentaire_admin && (
          <div className="admin-comment">
            <strong>💬 Commentaire:</strong>
            <p>{stage.commentaire_admin}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="validation-card">
      <div className="card-header">
        <div>
          <h4>{stage.entreprise}</h4>
          <p>{stage.User?.nom} ({stage.User?.email})</p>
        </div>
        <StatutBadge statut={stage.statut} />
      </div>

      <p className="stage-subject">{stage.sujet}</p>

      {stage.description && (
        <p className="stage-description">{stage.description}</p>
      )}

      <div className="stage-dates">
        📅 {new Date(stage.date_debut).toLocaleDateString('fr-FR')}
        <span> → </span>
        {new Date(stage.date_fin).toLocaleDateString('fr-FR')}
      </div>

      <div className="card-actions">
        {!showCommentaire ? (
          <>
            <button
              onClick={() => { setShowCommentaire(true); setIsRefusing(false); }}
              className="btn btn-success"
            >
              ✅ Valider
            </button>
            <button
              onClick={() => { setShowCommentaire(true); setIsRefusing(true); }}
              className="btn btn-danger"
            >
              ❌ Refuser
            </button>
          </>
        ) : (
          <div className="comment-section">
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder={isRefusing ? "Raison du refus (obligatoire)" : "Commentaire (optionnel)"}
              className="form-control"
              rows="3"
            />
            <div className="comment-actions">
              {isRefusing ? (
                <button
                  onClick={handleRefuser}
                  className="btn btn-danger"
                  disabled={!commentaire.trim()}
                >
                  Confirmer le Refus
                </button>
              ) : (
                <button
                  onClick={handleValider}
                  className="btn btn-success"
                >
                  Confirmer la Validation
                </button>
              )}
              <button
                onClick={() => {
                  setShowCommentaire(false);
                  setCommentaire('');
                  setIsRefusing(false);
                }}
                className="btn btn-secondary"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ValidationCard;