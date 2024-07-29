#!/bin/bash

# Atualizar o sistema e instalar dependências
sudo apt update
sudo apt upgrade -y
sudo apt install -y python3 python3-venv python3-pip nodejs npm git

# Configurar o backend com Flask
mkdir -p ~/myapp/backend/static/images
cd ~/myapp/backend

# Criar e ativar um ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar Flask e Flask-CORS
pip install Flask Flask-Cors

# Voltar para a pasta raiz
cd ~
# Configurar o frontend com React
npx create-react-app myapp/frontend
cd myapp/frontend

# Instalar React Router e Axios
npm install react-router-dom axios

# Atualizar package.json para incluir os scripts corretos e versões atualizadas
cat <<EOT > package.json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "axios": "^1.2.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.3.0",
    "react-scripts": "^5.0.0",
    "web-vitals": "^2.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOT

# Iniciar o backend
cd ~/myapp/backend
source venv/bin/activate
nohup python app.py &

# Iniciar o frontend
cd ~/myapp/frontend
npm start
