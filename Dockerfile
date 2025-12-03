# /frontend/Dockerfile
# Imagen base (Node.js para desarrollo)
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencia e instalar
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copiar el resto del código
COPY . .

# Comando de ejecución (ej. Iniciar el servidor de desarrollo)
CMD npm run dev
# o "npm start", dependiendo de tu proyecto