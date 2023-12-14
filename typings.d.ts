import '@umijs/max/typings';

declare global {
  interface Window {
    dynamicRoutes: any;
    loading: boolean
  }
}
