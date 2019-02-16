import * as React from 'react';

import Header from './header';
import Router from './router';

class App extends React.Component<{}, {}> {
  render() {
    return (
      <main>
        <Header />
        <Router />
      </main>
    );
  }
}

export default App;

