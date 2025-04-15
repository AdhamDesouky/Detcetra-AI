@echo off
echo Setting up React frontend...

cd frontend
npx create-react-app . --template typescript
npm install react-bootstrap bootstrap axios react-router-dom @types/react-router-dom

echo Frontend setup complete. You can start the development server with:
echo npm start 