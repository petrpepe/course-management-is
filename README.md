# Course-management-is
Course management information system

You can run this project via `npm run dev` command

This command will run both backend and frontend

This system is using env variables. To use this system properly it needs following .env varibles:
```
NODE_ENV = enviroment in which you want to run system, either production or development

PORT = optional port for backend

MONGO_URI = connection string for MongoDB

JWT_SECRET = secret for JWT tokens

EMAIL_API_KEY = api key from sendinblue for sending e-mails
```
