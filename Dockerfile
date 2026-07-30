FROM denoland/deno:alpine-2.1.9

WORKDIR /app

# Code applicatif (le .env est EXCLU via .dockerignore et monté au runtime :
# les secrets ne sont jamais dans l'image).
COPY . .

# Pré-cache des dépendances (oak, cors, npm:drizzle-orm, npm:pg…) d'après
# deno.lock → build reproductible + démarrage rapide.
RUN deno cache src/server.ts

EXPOSE 8000

# --allow-read : .env (dotenv) + src/public (fichiers statiques servis par oak).
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "src/server.ts"]
