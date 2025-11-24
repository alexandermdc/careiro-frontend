# Etapa 1: Build
FROM node:18-alpine AS build

# Define ARG para receber a URL da API via build args
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar o resto do código (incluindo .env)
COPY . .

# Build da aplicação (o Vite vai ler o .env automaticamente)
RUN npm run build

# Etapa 2: Produção com Nginx
FROM nginx:alpine

# Copiar build para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando padrão do Nginx
CMD ["nginx", "-g", "daemon off;"]
