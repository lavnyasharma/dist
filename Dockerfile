FROM nginx:1.19.0

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY ./dist/context-bot/ ./
COPY ./widget/ ./widget/

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/

CMD nginx -g 'daemon off;'