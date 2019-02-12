import * as React from 'react';

import List from './list';

export interface AppProps { name: string; }

class App extends React.Component<AppProps, {}> {
  render() {
    return (
      <div>
        <List/>
      </div>
    );
  }
}

export default App;

