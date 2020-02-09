# Two steps were removed since they were too big for bitbucket pipeline
# (Error: Container 'docker' exceeded memory limit)
# even after the option "size: 2x" in the pipeline
# So the build operation of the Angular project was made before the push to bitbucket

# Copies in our code and build both angular and express
FROM node:12-alpine as builder
WORKDIR /usr/src/app
EXPOSE 3000
COPY package*.json ./
COPY angular-src/package*.json ./angular-src/
RUN npm install
#RUN cd angular-src \
#    && npm install
COPY . ./
RUN npm run build
#RUN cd angular-src \
#    && npm run build:prod
RUN cp -r angular-src/dist dist
RUN mv dist/dist dist/angular-dist

# Starts and Serves Server
FROM node:12-alpine as production
WORKDIR /app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --production
CMD ["npm", "start"]