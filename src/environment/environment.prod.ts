// Production build (Docker / Kubernetes, Day 4):
// the browser calls /api on the SAME address it loaded the page from,
// and nginx inside the frontend container forwards it to the backend.
// No IP addresses are baked into the app any more.
export const environment = {
  production: true,
  apiUrl: '/api'
};
