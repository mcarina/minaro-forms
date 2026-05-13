FROM node:20-alpine

WORKDIR /workspace

RUN corepack enable

EXPOSE 3000

CMD sh -c '\
if [ ! -f /app/package.json ]; then \
  cd /tmp && \
  npx create-next-app@latest app \
    --yes \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir \
    --use-npm && \
  cp -R /tmp/app/* /app/; \
fi && \
cd /app && npm run dev'