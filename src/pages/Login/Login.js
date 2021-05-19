import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import BaseContext from '../../BaseContext';
import axios from 'axios';

class Login extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    login() {
        if(this.state.email && this.state.password) {
            let formData = new FormData();
            formData.append('email', this.state.email);
            formData.append('password', this.state.password);

            axios.post('/auth/login', formData)
            .then(res => {
                let token = res.data.data.token;
                this.context.setBaseState('token', token);
                localStorage.setItem('token', token);
            })
            .catch(err => {
                
            });
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mx-auto">
                        <div className="card card-white">
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input className="form-control" type="text" name="email" value={this.state.email} onChange={this.handleInputChange}/>
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleInputChange}/>
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-primary" type="button" onClick={this.login}>Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(Login);