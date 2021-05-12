import { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PageWrapper from './pages/PageWrapper';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact render={(props) => <PageWrapper pageName='welcome' {...props}/>}/>
          <Route render={(props) => <PageWrapper pageName='' {...props} />} />
        </Switch>
      </BrowserRouter>
    )
  }

}

export default App;