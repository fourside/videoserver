import * as React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import List from './list';

export default () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/list" component={List} />
      <Route exact path="/list/:category" component={List} />
    </div>
  </BrowserRouter>
);

const Home = () => (
  <h2>
    home
  </h2>
);
