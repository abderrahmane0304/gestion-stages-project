-- ================================================================================
-- CRÉATION DE LA BASE DE DONNÉES - GESTION DES STAGES
-- ================================================================================

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS gestion_stages;
USE gestion_stages;

-- ================================================================================
-- TABLE USERS (Utilisateurs)
-- ================================================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('etudiant', 'admin') NOT NULL DEFAULT 'etudiant',
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- TABLE STAGES (Déclarations de stages)
-- ================================================================================
CREATE TABLE IF NOT EXISTS stages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_etudiant INT NOT NULL,
  entreprise VARCHAR(150) NOT NULL,
  sujet VARCHAR(255) NOT NULL,
  description TEXT,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  statut ENUM('en_attente', 'valide', 'refuse') NOT NULL DEFAULT 'en_attente',
  commentaire_admin TEXT,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (id_etudiant) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT check_dates CHECK (date_fin > date_debut),
  INDEX idx_etudiant (id_etudiant),
  INDEX idx_statut (statut),
  INDEX idx_entreprise (entreprise),
  INDEX idx_dates (date_debut, date_fin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- INSERTION DE DONNÉES DE TEST
-- ================================================================================

-- Utilisateurs étudiants
INSERT INTO users (nom, email, password, role) VALUES
('Ahmed Bennani', 'ahmed@student.com', 'password123', 'etudiant'),
('Fatima Moubarik', 'fatima@student.com', 'password123', 'etudiant'),
('Mohammed Saïd', 'mohammed@student.com', 'password123', 'etudiant'),
('Yasmine Aziz', 'yasmine@student.com', 'password123', 'etudiant'),
('Karim Belaid', 'karim@student.com', 'password123', 'etudiant');

-- Utilisateurs administrateurs
INSERT INTO users (nom, email, password, role) VALUES
('Admin ESITH', 'admin@esith.ma', 'admin123', 'admin'),
('Responsable Stages', 'responsable@esith.ma', 'admin123', 'admin');

-- Déclarations de stages
INSERT INTO stages (id_etudiant, entreprise, sujet, description, date_debut, date_fin, statut) VALUES
(1, 'Maroc Telecom', 'Développement Python - Automation des fichiers', 'Automatisation des processus de traitement de fichiers', '2024-07-01', '2024-09-01', 'valide'),
(2, 'OCP Group', 'Machine Learning - Prédiction de production', 'Développement d\'algorithmes ML pour optimiser la production', '2024-06-15', '2024-08-31', 'en_attente'),
(3, 'LEONI', 'Robotique SCARA - Automation industrielle', 'Modélisation et contrôle d\'un bras robotique SCARA', '2024-07-15', '2024-09-15', 'refuse'),
(4, 'Accenture', 'Web Development - Full Stack React', 'Développement d\'application web avec React et Node.js', '2024-08-01', '2024-10-01', 'en_attente'),
(5, 'MSDA', 'Desalination - Traitement d\'eau', 'Étude et mise en œuvre de systèmes de dessalement', '2024-07-01', '2024-09-30', 'valide');

-- ================================================================================
-- REQUÊTES UTILES
-- ================================================================================

-- Afficher tous les utilisateurs
-- SELECT * FROM users;

-- Afficher tous les stages avec les informations de l'étudiant
-- SELECT s.*, u.nom, u.email FROM stages s 
-- JOIN users u ON s.id_etudiant = u.id 
-- ORDER BY s.date_creation DESC;

-- Compter les stages par statut
-- SELECT statut, COUNT(*) as total FROM stages GROUP BY statut;

-- Afficher les stages d'un étudiant spécifique
-- SELECT * FROM stages WHERE id_etudiant = 1 ORDER BY date_creation DESC;

-- Afficher les stages en attente de validation
-- SELECT s.*, u.nom, u.email FROM stages s 
-- JOIN users u ON s.id_etudiant = u.id 
-- WHERE s.statut = 'en_attente' 
-- ORDER BY s.date_creation ASC;