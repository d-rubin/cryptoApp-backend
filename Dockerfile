# Verwende ein Node.js-Image (z.B. slim, damit OpenSSL bereits installiert oder leicht hinzufügbar ist)
FROM --platform=linux/amd64 node:20-slim

# Aktualisiere und installiere notwendige Pakete (z.B. OpenSSL)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Generiere den Prisma Client innerhalb des Containers
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 8000

# Command to run the application
CMD ["node", "dist/main"]