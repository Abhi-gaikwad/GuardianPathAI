# Step 1: Use a base image
FROM node:14 AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Use a lightweight server to serve the production build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port on which the app will run
EXPOSE 80

# Start the server
CMD ["nginx", "-g", "daemon off;"]
