// Address of the Spring Boot backend.
// Running on EC2? Replace localhost with the PUBLIC IP of the backend instance,
// e.g. 'http://13.233.x.x:8080/api'
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
