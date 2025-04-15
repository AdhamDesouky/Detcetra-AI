@echo off
echo Setting up PostgreSQL in Docker...

"C:\Program Files\Docker\Docker\resources\bin\docker.exe" pull postgres:latest
"C:\Program Files\Docker\Docker\resources\bin\docker.exe" run --name mammo-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=mammo_db -p 5432:5432 -d postgres:latest

echo PostgreSQL container is running. You can connect using:
echo Host: localhost
echo Port: 5432
echo Database: mammo_db
echo Username: postgres
echo Password: postgres 