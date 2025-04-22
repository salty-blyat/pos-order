cd ..
call ng build
cd .docker

call C:\Docker\d3\d3-docker.cmd

docker build .. --file ../.docker/Dockerfile -t dkr.sgx.bz/hotel-ui
docker push dkr.sgx.bz/hotel-ui
docker-compose -f hotel-ui.yml -p hotel up -d

PAUSE

