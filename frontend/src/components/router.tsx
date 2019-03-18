import * as React from 'react';
import { Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Loading from './loading';

const Header = React.lazy(() => import('./header'));
const Home = () => <h2>home</h2>;
const List = React.lazy(() => import('./list'));
const Modal = React.lazy(() => import('../container/modal'));

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
      <Modal />
    </Suspense>
  </BrowserRouter>
);

export default Router;
