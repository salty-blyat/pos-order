FROM nginx:1.17.1-alpine

COPY ./src/assets/setting.json ./dist/assets/setting.json
COPY ./src/assets/setting.template.json ./dist/assets/setting.template.json
COPY ./src/assets/version.json ./dist/assets/version.json

COPY ./dist/pbs-ui/browser/ /usr/share/nginx/html
COPY ./.docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/setting.template.json > /usr/share/nginx/html/assets/setting.json && exec nginx -g 'daemon off;'"]
