import { useRoutes } from 'react-router-dom';
import { routes } from 'docspack:routes';

console.log(routes, 'routes');
export const Content = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};
