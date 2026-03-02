// Route constants - All route paths in the app
export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  BUSES: '/buses',
  BUS_DETAIL: (id: string) => `/buses/${id}`,
  LOGIN: '/auth/login',
  SIGNUP: '/auth/sign-up',
  CUSTOMER_DASHBOARD: '/dashboard',
  OPERATOR_DASHBOARD: '/dashboard',
};
