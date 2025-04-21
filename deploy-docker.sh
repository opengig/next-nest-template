# REPO="repo-name"
# echo "$HOME/$REPO"
# cd "$HOME/$REPO"

git pull

echo "Building and starting docker containers"
export COMPOSE_BAKE=true
docker compose up -d --build
echo "Docker containers started"