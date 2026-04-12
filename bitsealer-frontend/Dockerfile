# ---------- Fase 1: build (Node) ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos manifiestos primero para cachear deps
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código
COPY . .

# Variables de build (Vite usa import.meta.env.VITE_*)
# Puedes sobreescribir VITE_API_BASE en el 'docker build' con --build-arg
ARG VITE_API_BASE
ENV VITE_API_BASE=${VITE_API_BASE}

# Compilar
RUN npm run build

# ---------- Fase 2: runtime (Nginx) ----------
FROM nginx:1.27-alpine
# Config SPA con fallback a /index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiamos artefacto estático
COPY --from=builder /app/dist /usr/share/nginx/html
# Expone puerto 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
