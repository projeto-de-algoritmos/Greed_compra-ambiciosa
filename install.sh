#!/bin/bash

# Atualizar o sistema e instalar dependências
sudo apt update
sudo apt upgrade -y
sudo apt install -y python3 python3-venv python3-pip nodejs npm git

# Configurar o backend com Flask
cd  backend

# Criar e ativar um ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar Flask e Flask-CORS
pip install Flask Flask-Cors

# Voltar para a pasta raiz
cd ..
# Configurar o frontend com React
npx create-react-app frontend
cd frontend

# Instalar React Router e Axios
npm install react-router-dom axios


# Iniciar o backend
cd ../backend
source venv/bin/activate
flask run &


# Iniciar o frontend
cd ../frontend
npm start
