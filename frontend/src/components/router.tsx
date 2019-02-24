import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Header from './header';
import List from './list';

const Router = () => (
  <BrowserRouter>
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/list" component={List} />
        <Route path="/list/:category" component={List} />
        <Route component={Home} />
      </Switch>
    </div>
  </BrowserRouter>
);

const Home = () => (
  <h2>
    home
  </h2>
);

export default Router;
