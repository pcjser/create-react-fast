import { lazy } from 'react';
import { Route, Redirect } from 'react-router-dom';

const routes = [
  {
    key: 'index',
    path: '/index',
    title: '首页',
    file: 'Index',
  },
  {
    key: 'detail',
    path: '/detail',
    title: '详情页',
    file: 'Detail'
  }
];

routes.unshift({
  key: '/',
  path: '/',
  redirect: '/index',
  exact: true,
})

const Routes = () => {

  return (
    <>
      {routes.map(({ key, file, redirect, ...rest }) =>
        redirect ?
          <Route
            {...rest}
            key={key}
            render={() => <Redirect to={redirect} />}
          />
          :
          <Route
            {...rest}
            key={key}
            component={lazy(() => import(`./containers/${file}`))}
          />
      )}
    </>
  )
};

export default Routes;