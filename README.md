<p align="center">
  <img src="https://raw.githubusercontent.com/aymanenajibi/CRM-Insurance/d50f0f81324cf9baca89c2d9b151f3d6860ef444/frontend/public/images/logo/auth-logo.svg" width="" alt="PoliSys Logo">
</p>
<p align="center">
  Une application CRM moderne avec React (frontend) et FastAPI (backend)
</p>

<p align="center">
  <a href="#-fonctionnalités">Fonctionnalités</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-démarrage-rapide">Démarrage rapide</a> •
  <a href="#-technologies">Technologies</a> •
  <a href="#-auteurs">Auteurs</a>
</p>

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec JWT (JSON Web Tokens)
- 👥 **Gestion des utilisateurs** (création, modification, suppression)
- 📊 **Interface dashboard** avec statistiques et visualisations
- 🔄 **API REST complète** avec documentation interactive (Swagger/ReDoc)
- 🎨 **UI moderne** avec Tailwind CSS et composants React
- 🗄️ **Base de données PostgreSQL** avec SQLAlchemy ORM
- 🔒 **CORS configurable** pour la sécurité des requêtes

## 🏗️ Architecture

```
PoliSys/
│
├── 📁 frontend/          # Application React + TypeScript
│   ├── src/
│   │   ├── components/   # Composants React réutilisables
│   │   ├── pages/        # Pages de l'application
│   │   ├── services/     # Services API (Axios)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── images/       # Logos et images
│   ├── package.json
│   └── README.md
│
├── 📁 backend/           # API FastAPI + PostgreSQL
│   ├── app/
│   │   ├── routes/       # Routes de l'API
│   │   ├── models/       # Modèles SQLAlchemy
│   │   ├── schemas/      # Schémas Pydantic
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── create_tables.py
│   └── README.md
│
├── 📄 .gitignore
├── 📄 LICENSE
└── 📄 README.md          (ce fichier)
```

## 🚀 Installation

### Prérequis

- **Node.js** (v18+)
- **Python** (3.10+)
- **PostgreSQL** (v14+)
- **npm** ou **yarn**
- **pip** (gestionnaire de paquets Python)

### Clonage du projet

```bash
git clone <votre-url-de-dépôt>
cd PoliSys
```

## ⚡ Démarrage rapide

### 1. Lancer le backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# Créer le fichier .env (voir instructions ci-dessous)
# Configurer la base de données PostgreSQL

python create_tables.py
uvicorn app.main:app --reload
```

📌 **Backend accessible sur :** http://127.0.0.1:8000
📚 **Documentation API :** http://127.0.0.1:8000/docs

### 2. Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

🌐 **Frontend accessible sur :** http://localhost:5173


## ⚙️ Configuration

### Fichiers d'environnement

#### Backend (`backend/.env`)
```env
ENVIRONMENT=development
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:5173
DATABASE_URL=postgresql://postgres:root@localhost:5432/crm_db
SECRET_KEY=votre_clé_secrète_ici
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Frontend (`frontend/.env.local`)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_ENV=development
VITE_APP_TITLE=PoliSys CRM
```

## 🛠️ Technologies

### **Frontend**
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) React 18
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) TypeScript
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) Tailwind CSS
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) Axios
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) Vite

### **Backend**
- ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) FastAPI
- ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) Python 3.10+
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) PostgreSQL
- ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat&logo=sqlalchemy&logoColor=white) SQLAlchemy ORM
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) JWT Authentication


## 📚 Documentation détaillée

Pour des instructions plus détaillées, consultez les README individuels :

- [**Frontend**](./frontend/README.md) - Guide d'installation et d'utilisation du frontend
- [**Backend**](./backend/README.md) - Guide d'installation et de configuration du backend


## 👥 Auteurs

Projet réalisé dans le cadre d'un projet d'étude.

**Équipe de développement :**
- [Aymane Najibi](https://github.com/aymanenajibi)
- [Badr MANYANI](https://github.com/BadrManyani2003)
- [Zouhair EDDOUBAJI](https://github.com/ZouhairDev49)

---


<p align="center">
  <i>Construit avec ❤️ en utilisant React et FastAPI</i>
</p>
