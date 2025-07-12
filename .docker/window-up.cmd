cd ..
call ng build
cd .docker

call C:\Docker\d3\d3-docker.cmd

docker build .. --file ../.docker/Dockerfile -t dkr.sgx.bz/hotel-portal
docker push dkr.sgx.bz/hotel-portal
docker-compose -f hotel-portal.yml -p hotel-portal up -d

PAUSE

