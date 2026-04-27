# ============================================================
#  TON TRAVAIL — Créer les Dockerfiles + Déployer sur AKS
# ============================================================

## STRUCTURE REÇUE DU DÉVELOPPEUR
```
app/
├── backend/
│   ├── src/server.js     ← API Node.js Express + Azure SQL
│   └── package.json
├── frontend/
│   ├── public/index.html
│   ├── src/App.js        ← Interface React
│   ├── src/index.js
│   └── package.json
└── init-db.sql           ← Script SQL à exécuter en premier
```

---

## ÉTAPE 1 — Créer la table SQL
Portail Azure → SQL Database → Query Editor → coller init-db.sql

---

## ÉTAPE 2 — Créer Dockerfile backend
Crée le fichier : app/backend/Dockerfile

---

## ÉTAPE 3 — Créer Dockerfile frontend  
Crée le fichier : app/frontend/Dockerfile

---

## ÉTAPE 4 — Build et Push vers ACR
```bash
az acr login --name myacrdemorepo

# Backend
az acr build --registry myacrdemorepo --image backend:v1 --file backend/Dockerfile ./backend

# Frontend
az acr build --registry myacrdemorepo --image frontend:v1 --file frontend/Dockerfile ./frontend
```

---

## ÉTAPE 5 — Déployer sur AKS
```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl get pods --watch
```
