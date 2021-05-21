import { Component } from 'react';
import { Redirect } from 'react-router';

class AuthHandler extends Component {

    render() {
        let token = localStorage.getItem('token');

        if(this.props.auth == 'private') {
            if(!token) {
                return <Redirect to={'/guru/login'} />
            }
        }
        
        if(this.props.auth == 'guest') {
            if(token) {
                return <Redirect to={'/guru'} />
            }
        }

        return this.props.children;

    }

}

export default AuthHandler;