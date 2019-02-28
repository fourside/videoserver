import * as React from 'react';
import { Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Loading from './loading';
const Header = React.lazy(() => import('./header'));
const Home = () => <h2>home</h2>;
const List = React.lazy(() => import('./list'));

const Router = () => (
  <BrowserRouter>
    <Suspense fallback={<Loading />}>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/list" component={List} />
        <Route path="/list/:category" component={List} />
        <Route component={Home} />
      </Switch>
    </Suspense>
  </BrowserRouter>
);

export default Router;
