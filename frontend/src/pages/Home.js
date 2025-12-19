import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home({ onLogin }) {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    role: 'etudiant'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Données de test
      const testAccounts = {
        etudiant: [
          { id: 1, email: 'ahmed@student.com', password: 'password123' },
          { id: 2, email: 'fatima@student.com', password: 'password123' },
          { id: 3, email: 'mohammed@student.com', password: 'password123' },
        ],
        admin: [
          { id: 6, email: 'admin@esith.ma', password: 'admin123' },
          { id: 7, email: 'responsable@esith.ma', password: 'admin123' }
        ]
      };

      const accounts = testAccounts[loginForm.role];
      const user = accounts.find(u => u.email === loginForm.email && u.password === loginForm.password);

      if (user) {
        onLogin(user.id, loginForm.role);
        navigate(loginForm.role === 'etudiant' ? '/etudiant' : '/admin');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>📚 Gestion des Stages</h1>
        <p className="subtitle">Plateforme de Déclaration & Suivi des Stages</p>

        <div className="login-box">
          <h2>Se Connecter</h2>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="role">Rôle:</label>
              <select
                id="role"
                name="role"
                value={loginForm.role}
                onChange={handleChange}
                className="form-control"
              >
                <option value="etudiant">Étudiant</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe:</label>
              <input
                id="password"
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Connexion...' : 'Se Connecter'}
            </button>
          </form>

          <div className="test-accounts">
            <h3>Comptes de Test:</h3>
            <p><strong>Étudiant:</strong> ahmed@student.com / password123</p>
            <p><strong>Administrateur:</strong> admin@esith.ma / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
