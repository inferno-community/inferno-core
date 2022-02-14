export const basePath = document.getElementById('base-path')?.content;
const apiEndpoint = (basePath === '' ? '/api' : `/${basePath}/api`).replaceAll('//', '/');

type parameter = {
  name: string;
  value: string;
};

export function getApiEndpoint(route: string, parameters?: parameter[]): string {
  if (parameters) {
    const parametersString = parameters
      .map((parameter) => `${parameter.name}=${parameter.value}`)
      .join('&');
    return `${apiEndpoint}${route}?${parametersString}`;
  }
  const separator = route.startsWith('/') ? '' : '/';

  return apiEndpoint + separator + route;
}

export function getStaticPath(route: string): string {
  if(process.env.NODE_ENV !== 'production') {
    return route;
  }

  return getPath(route);
}

export function getPath(route: string): string {
  const separator = route.startsWith('/') ? '' : '/';
  const prefix = basePath === '' ? '' : '/';

  return prefix + basePath + separator + route;
}
