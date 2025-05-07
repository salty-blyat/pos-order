cd ..
call ng build
cd .docker

call C:\Docker\d3\d3-docker.cmd

docker build .. --file ../.docker/Dockerfile -t dkr.sgx.bz/vip-ui
docker push dkr.sgx.bz/vip-ui
docker-compose -f vip-ui.yml -p vip up -d

PAUSE

