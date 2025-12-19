import React, { useState } from 'react';
import stageService from '../services/stageService';
import '../styles/DeclarationForm.css';

function DeclarationForm({ userId, onStageCreated }) {
  const [form, setForm] = useState({
    entreprise: '',
    sujet: '',
    description: '',
    date_debut: '',
    date_fin: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.entreprise.trim()) newErrors.entreprise = 'Entreprise requise';
    if (!form.sujet.trim()) newErrors.sujet = 'Sujet requis';
    if (!form.date_debut) newErrors.date_debut = 'Date de début requise';
    if (!form.date_fin) newErrors.date_fin = 'Date de fin requise';

    if (form.date_debut && form.date_fin) {
      if (new Date(form.date_fin) <= new Date(form.date_debut)) {
        newErrors.date_fin = 'La date de fin doit être après la date de début';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const newStage = await stageService.create({
        ...form,
        id_etudiant: userId
      });
      onStageCreated(newStage);
      setForm({
        entreprise: '',
        sujet: '',
        description: '',
        date_debut: '',
        date_fin: ''
      });
    } catch (error) {
      setErrors({ submit: 'Erreur lors de la création du stage' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="declaration-form" onSubmit={handleSubmit}>
      <h3>📝 Déclarer un Nouveau Stage</h3>

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-group">
        <label htmlFor="entreprise">Entreprise: *</label>
        <input
          id="entreprise"
          type="text"
          name="entreprise"
          value={form.entreprise}
          onChange={handleChange}
          placeholder="Nom de l'entreprise"
          className={`form-control ${errors.entreprise ? 'is-invalid' : ''}`}
        />
        {errors.entreprise && <span className="error-text">{errors.entreprise}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="sujet">Sujet du Stage: *</label>
        <input
          id="sujet"
          type="text"
          name="sujet"
          value={form.sujet}
          onChange={handleChange}
          placeholder="Sujet/Titre du stage"
          className={`form-control ${errors.sujet ? 'is-invalid' : ''}`}
        />
        {errors.sujet && <span className="error-text">{errors.sujet}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Décrivez les activités du stage (optionnel)"
          className="form-control"
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date_debut">Date de Début: *</label>
          <input
            id="date_debut"
            type="date"
            name="date_debut"
            value={form.date_debut}
            onChange={handleChange}
            className={`form-control ${errors.date_debut ? 'is-invalid' : ''}`}
          />
          {errors.date_debut && <span className="error-text">{errors.date_debut}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date_fin">Date de Fin: *</label>
          <input
            id="date_fin"
            type="date"
            name="date_fin"
            value={form.date_fin}
            onChange={handleChange}
            className={`form-control ${errors.date_fin ? 'is-invalid' : ''}`}
          />
          {errors.date_fin && <span className="error-text">{errors.date_fin}</span>}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Création...' : 'Déclarer le Stage'}
      </button>
    </form>
  );
}

export default DeclarationForm;
