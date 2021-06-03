import { Component } from 'react';
import { Link } from 'react-router-dom';
import BaseContext from '../../../BaseContext';
import axios from 'axios';

import style from './Login.module.scss';

class Login extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loginLoading: false,
            error: {
                email: '',
                password: ''
            }
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    login(e) {
        e.preventDefault();
        this.setState({error: {email: '', password: ''}});
        
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
                    this.setState({ error: {email: 'Telah terjadi kesalahan' }, loginLoading: false});
                });
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 400) {
                        this.setState({ error: { email: 'Email atau password salah', password: 'Email atau password salah' }});
                    } else {
                        this.setState({ error: {email: 'Telah terjadi kesalahan' }});
                    }
                } else {
                    this.setState({ error: {email: 'Telah terjadi kesalahan' }});
                }

                this.setState({loginLoading: false});
            });
        } else {
            let newState = {};
            if(!this.state.email) {
                newState['email'] = 'Email tidak boleh kosong';
            }

            if(!this.state.password) {
                newState['password'] = 'Password tidak boleh kosong';
            }

            this.setState({error: newState});
        }
    }

    showErrorMessage(key) {
        if (this.state.error[key]) {
            return (
                <div className="invalid-feedback">
                    { this.state.error[key] }
                </div>
            )
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
                            <input className={"form-control" + (this.state.error.email ? ' is-invalid' : '')} type="text" name="email" value={this.state.email} placeholder="name@domain.com" onChange={this.handleInputChange} />
                            {this.showErrorMessage('email')}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input className={"form-control" + (this.state.error.password ? ' is-invalid' : '')} type="password" name="password" value={this.state.password} placeholder="Password" onChange={this.handleInputChange} />
                            {this.showErrorMessage('password')}
                        </div>

                        <div className="form-group mt-4">
                            <button className="btn btn-primary w-100" type="submit" disabled={this.state.loginLoading}>Log in</button>
                        </div>
                    </form>

                    <Link to={'/'}>Masuk sebagai siswa</Link>
                </div>

                <div className={style.illustrationContainer}>
                    <div className={style.illustration}></div>
                </div>
            </div>
        )
    }

}

export default Login;