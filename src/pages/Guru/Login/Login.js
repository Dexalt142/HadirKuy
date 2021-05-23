import { Component } from 'react';
import BaseContext from '../../../BaseContext';
import axios from 'axios';

import mainStyle from '../../../assets/scss/main.scss';
import style from './Login.module.scss';

class Login extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loginLoading: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    login(e) {
        e.preventDefault();
        
        if(this.state.email && this.state.password) {
            this.setState({loginLoading: true});
            let formData = new FormData();
            formData.append('email', this.state.email);
            formData.append('password', this.state.password);
            
            axios.post('/auth/login', formData)
            .then(res => {
                let token = res.data.data.token;
                
                axios.get('/auth/user', { headers: { Authorization: `Bearer ${token}` }})
                .then(userRes => {
                    let userData = userRes.data.data;
                    localStorage.setItem('token', token);
                    this.context.setBaseState('user_data', userData);

                    // this.setState({ loginLoading: false });
                    // this.props.history.push('/guru');
                })
                .catch(err => {

                });
            })
            .catch(err => {
                this.setState({loginLoading: false});
            });
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className={style.container}>
                <div className={style.loginFormContainer}>
                    <div className='pageTitleContainer'>
                        <div className='pageTitle'>
                            HadirKuy
                        </div>
                        <div className='pageSubtitle'>
                            Sistem Presensi Siswa Menggunakan Face Recognition
                        </div>
                    </div>

                    <form onSubmit={this.login} className='w-100'>
                        <div className="form-group">
                            <label>Email</label>
                            <input className="form-control" type="text" name="email" value={this.state.email} placeholder="name@domain.com" onChange={this.handleInputChange} />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input className="form-control" type="password" name="password" value={this.state.password} placeholder="Password" onChange={this.handleInputChange} />
                        </div>

                        <div className="form-group mt-4">
                            <button className="btn btn-primary w-100" type="submit" disabled={this.state.loginLoading}>Log in</button>
                        </div>
                    </form>
                </div>

                <div className={style.illustrationContainer}>
                    <div className={style.illustration}></div>
                </div>
            </div>
        )
    }

}

export default Login;