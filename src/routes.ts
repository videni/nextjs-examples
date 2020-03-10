import Routes from 'next-routes';

const routes =  new Routes();

routes
    .add('/', 'index')
  ;

export const Link = routes.Link;
export const Router = routes.Router;

export default routes;
