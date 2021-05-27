import { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BaseContext from './BaseContext';
import PageWrapper from './pages/PageWrapper';
import axios from 'axios';
import $ from 'jquery';

const BaseProvider = BaseContext.Provider;

class App extends Component {

  constructor(props) {
    super(props);

    axios.defaults.baseURL = 'https://hadirkuy.test/api';

    this.state = {
      api_url: 'http://hadirkuy.test',

      user_data: null,

      pertemuan: null,
      presensi: null,
      siswa: null
    };

    this.setBaseState = this.setBaseState.bind(this);
    this.revokeAuth = this.revokeAuth.bind(this);
  }

  setBaseState(key, data) {
    this.setState({
      [key]: data
    });
  }

  revokeAuth() {
    localStorage.removeItem('token');
    this.setState({user_data: null});
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

    $('.modal-backdrop').remove();
  }

  render() {
    return (
      <BaseProvider value={{baseState: this.state, setBaseState: this.setBaseState, revokeAuth: this.revokeAuth}}>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact render={(props) => <PageWrapper pageName='welcome' {...props}/>}/>
            <Route path="/scan" exact render={(props) => <PageWrapper pageName='scan' {...props}/>}/>
            <Route path="/rekap" exact render={(props) => <PageWrapper pageName='rekap' {...props}/>}/>
            <Route path="/guru" exact render={(props) => <PageWrapper pageName='guru' auth='private' {...props}/>}/>
            <Route path="/guru/siswa" exact render={(props) => <PageWrapper pageName='guru/siswa' auth='private' {...props}/>}/>
            <Route path="/guru/siswa/:id" exact render={(props) => <PageWrapper pageName='guru/siswa/detail' auth='private' {...props}/>}/>
            <Route path="/guru/pertemuan" exact render={(props) => <PageWrapper pageName='guru/pertemuan' auth='private' {...props}/>}/>
            <Route path="/guru/pertemuan/:id" exact render={(props) => <PageWrapper pageName='guru/pertemuan/detail' auth='private' {...props}/>}/>
            <Route path="/guru/login" exact render={(props) => <PageWrapper pageName='guru/login' auth='guest' {...props}/>}/>
            
            <Route render={(props) => <PageWrapper pageName='' {...props} />} />
          </Switch>
        </BrowserRouter>
      </BaseProvider>
    )
  }

}

export default App;