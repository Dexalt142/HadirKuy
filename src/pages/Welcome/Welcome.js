import { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import style from './Welcome.module.scss';
import BaseContext from '../../BaseContext';
import axios from 'axios';

class Welcome extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            kode_pertemuan: '',
            cekLoading: false,
            error: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.checkPertemuan = this.checkPertemuan.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    checkPertemuan(e) {
        e.preventDefault();
        this.setState({error: ''});

        if(this.state.kode_pertemuan) {
            this.setState({cekLoading: true});
            axios.get(`pertemuan/${this.state.kode_pertemuan}`)
            .then(res => {
                this.context.setBaseState('pertemuan', res.data.data);
                this.props.history.push('/scan');
            })
            .catch(err => {
                if(err.response) {
                    if(err.response.data.status = 404) {
                        this.setState({error: 'Pertemuan tidak ditemukan'});
                    }
                }

                this.setState({cekLoading: false});
            });
        } else {
            this.setState({error: 'Kode pertemuan tidak boleh kosong'});
        }
    }

    componentDidMount() {
    }

    showErrorMessage() {
        if(this.state.error) {
            return (
                <div className="invalid-feedback">
                    { this.state.error }
                </div>
            )
        }
    }

    render() {
        return (
            <div className={style.container}>
                <div className={style.illustrationContainer}>
                    <div className={style.illustration}></div>
                </div>

                <div className={style.pertemuanFormContainer}>
                    <div className='pageTitleContainer'>
                        <div className='pageTitle'>
                            HadirKuy
                        </div>
                        <div className='pageSubtitle'>
                            Sistem Presensi Siswa Menggunakan Face Recognition
                        </div>
                    </div>

                    <form onSubmit={this.checkPertemuan} className='w-100'>
                        <div className="form-group">
                            <label>Kode pertemuan</label>
                            <input className={"form-control" + (this.state.error ? ' is-invalid' : '')} type="text" name="kode_pertemuan" value={this.state.kode_pertemuan} placeholder="Kode pertemuan" onChange={this.handleInputChange} />
                            { this.showErrorMessage() }
                        </div>

                        <div className="form-group mt-4">
                            <button className="btn btn-primary w-100" type="submit" disabled={this.state.cekLoading}>Cek Pertemuan</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Welcome;