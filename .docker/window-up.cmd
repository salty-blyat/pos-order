cd ..
call ng build
cd .docker

call C:\Docker\d3\d3-docker.cmd

docker build .. --file ../.docker/Dockerfile -t dkr.sgx.bz/pos-order
docker push dkr.sgx.bz/pos-order
docker-compose -f pos-order.yml -p pos-order up -d

PAUSE

