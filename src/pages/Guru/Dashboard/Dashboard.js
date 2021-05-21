import { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import BaseContext from '../../../BaseContext';
import axios from 'axios';

class Dashboard extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            content: 'dashboard'
        };

        this.checkAuth = this.checkAuth.bind(this);
    }

    checkAuth() {
        if(localStorage.getItem('token')) {
            let localToken = localStorage.getItem('token');
            let config = {
                headers:  {
                    Authorization: `Bearer ${localToken}`
                } 
            }

            axios.get('/auth/user', config)
            .then(res => {
                let userData = res.data.data;
                this.context.setBaseState('user_data', userData);
            })
            .catch(err => {
                localStorage.clear('token');
                this.props.history.push('/guru/login');
            });
        } else {
            this.props.history.push('/guru/login');
        }
    }
    
    componentDidMount() {
        // this.checkAuth();
    }
    
    render() {
        if(!this.context.baseState.user_data) {
            return <Redirect to={'/guru/login'}/>;
        }

        let content = <div>Dashboard</div>;
        if(this.state.content == 'pertemuan') {
            content = <div>Pertemuan</div>; 
        }
        
        return (
            <div>
                { content }
            </div>
        )
    }

}

export default withRouter(Dashboard);