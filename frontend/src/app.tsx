import * as React from 'react';

import Router from './router';

class App extends React.Component<{}, {}> {
  render() {
    return (
      <main>
        <header>
          <h1 className="title">video server</h1>
        </header>
        <Router />
      </main>
    );
  }
}

export default App;

