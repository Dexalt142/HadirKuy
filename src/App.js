import { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BaseContext from './BaseContext';
import PageWrapper from './pages/PageWrapper';
import axios from 'axios';

const BaseProvider = BaseContext.Provider;

class App extends Component {

  constructor(props) {
    super(props);

    axios.defaults.baseURL = 'http://hadirkuy.test/api';

    this.state = {
      api_url: 'http://hadirkuy.test',

      user_data: null,

      pertemuan: null,
      presensi: null,
    };

    this.setBaseState = this.setBaseState.bind(this);

  }

  setBaseState(key, data) {
    this.setState({
      [key]: data
    });
  }

  componentDidMount() {
    if(localStorage.getItem('token')) {
      let localToken = localStorage.getItem('token');
      let config = {
        headers: 
        {
          Authorization: `Bearer ${localToken}`
        } 
      }

      axios.get('/auth/user', config)
      .then(res => {
        let userData = res.data.data;
        this.setState({user_data: userData});
      })
      .catch(err => {
        localStorage.clear('token');
      });
    }
  }

  render() {
    return (
      <BaseProvider value={{baseState: this.state, setBaseState: this.setBaseState}}>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact render={(props) => <PageWrapper pageName='welcome' {...props}/>}/>
            <Route path="/scan" exact render={(props) => <PageWrapper pageName='scan' {...props}/>}/>
            <Route path="/guru" exact render={(props) => <PageWrapper pageName='guru' auth='private' {...props}/>}/>
            <Route path="/guru/siswa" exact render={(props) => <PageWrapper pageName='guru/siswa' auth='private' {...props}/>}/>
            <Route path="/guru/pertemuan" exact render={(props) => <PageWrapper pageName='guru/pertemuan' auth='private' {...props}/>}/>
            <Route path="/guru/login" exact render={(props) => <PageWrapper pageName='guru/login' auth='guest' {...props}/>}/>
            
            <Route render={(props) => <PageWrapper pageName='' {...props} />} />
          </Switch>
        </BrowserRouter>
      </BaseProvider>
    )
  }

}

export default App;