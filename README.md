# user-management-frontend (Day 1)

Angular app with two pages:

- **/register** – form to register a user (name, email, password)
- **/users** – table of all registered users

## Prerequisites
- Node.js 20+
- Angular CLI 20 (`npm install -g @angular/cli@20.3.7`)
- Backend running on port 8080

## Run
```bash
npm install
ng serve                    # http://localhost:4200
ng serve --host 0.0.0.0     # on EC2, so it is reachable from your browser
```

## Backend URL
Set in `src/environment/environment.ts`. On EC2, replace `localhost` with the
**public IP** of the backend instance.
