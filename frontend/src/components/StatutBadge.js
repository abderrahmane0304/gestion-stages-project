import React from 'react';
import '../styles/StatutBadge.css';

function StatutBadge({ statut }) {
  const badges = {
    en_attente: { label: 'En Attente', icon: '⏳', color: 'warning' },
    valide: { label: 'Validé', icon: '✅', color: 'success' },
    refuse: { label: 'Refusé', icon: '❌', color: 'danger' }
  };

  const badge = badges[statut] || badges.en_attente;

  return (
    <span className={`badge badge-${badge.color}`}>
      {badge.icon} {badge.label}
    </span>
  );
}

export default StatutBadge;
