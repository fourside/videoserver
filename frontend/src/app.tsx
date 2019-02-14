import * as React from 'react';

import List from './list';

class App extends React.Component<{}, {}> {
  render() {
    return (
      <main>
        <header>
          <h1 className="title">video server</h1>
        </header>
        <List/>
      </main>
    );
  }
}

export default App;

