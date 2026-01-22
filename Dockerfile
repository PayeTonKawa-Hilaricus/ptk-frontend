# On part d'une image Nginx légère
FROM nginx:alpine

# On supprime la page par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# On copie TOUT ton projet (admin, client, js, index.html) dans le dossier public de Nginx
COPY . /usr/share/nginx/html

# On expose le port 80 (standard web)
EXPOSE 80

# On lance Nginx
CMD ["nginx", "-g", "daemon off;"]