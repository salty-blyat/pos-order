cd ..
call ng build
cd .docker

call C:\Docker\d3\d3-docker.cmd

docker build .. --file ../.docker/Dockerfile -t dkr.sgx.bz/pbs-ui
docker push dkr.sgx.bz/pbs-ui
docker-compose -f pbs-ui.yml -p pbs up -d

PAUSE

