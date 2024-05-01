# Use a Node.js base image
FROM node:20.11.0

# Environment variables
ENV MONGO_DB="mongodb+srv://chirantha:chirapass@cluster0.xcmczoo.mongodb.net/expense?retryWrites=true&w=majority&appName=Cluster0"
ENV PORT=3000

# Set the working directory in the container
WORKDIR /usr/src/app 

# Copy the package.json and package-lock.json files to the container
COPY expense-tracker/package*.json /  

# Install dependencies with npm ci (ensures exact dependency versions from package-lock.json)
RUN npm ci
RUN npm install -g nodemon
# Copy the rest of the application files to the container
COPY expense-tracker/ .  

# Expose the port the app will run on
EXPOSE 3000

# Start the application using npm
CMD ["npm", "run", "dev"]
