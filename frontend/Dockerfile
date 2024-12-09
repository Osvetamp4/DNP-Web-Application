FROM node:18

#set the working directory inside this container to /app
WORKDIR /app

#Copy the package files to the working directory
COPY package*.json ./

#npm install all the dependencies into the workdir
RUN npm install

RUN rm -rf .vite node_modules/.vite

#Copy all of the frontend react code into workdir
COPY . .

#creates the build folder with the converted .jsx files and optimized frontend code. This is packaged for the backend to serve to the user.
RUN npm run build

