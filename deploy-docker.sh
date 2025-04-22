git pull

echo "Building and starting docker containers"
export COMPOSE_BAKE=true
docker compose up -d --build
echo "Docker containers started"