import * as React from 'react';

export interface AppProps { name: string; }

class App extends React.Component<AppProps, {}> {
  render() {
    return (
      <div>
        <p>hello {this.props.name}</p>
      </div>
    );
  }
}

export default App;

