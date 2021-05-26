import { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import BaseContext from '../../../BaseContext';
import axios from 'axios';

import $ from 'jquery';
import layoutStyle from '../LayoutGuru.module.scss';
import style from './Pertemuan.module.scss';

class Pertemuan extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            pertemuan: null,
            createLoading: false,
            nama: '',
            tanggal: '',
            waktu: '',
            error: {
                nama: null,
                tanggal: null,
                waktu: null,
            }
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.fetchPertemuan = this.fetchPertemuan.bind(this);
        this.createPertemuan = this.createPertemuan.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    showErrorMessage(key) {
        if (this.state.error[key]) {
            return (
                <div className="invalid-feedback">
                    { this.state.error[key]}
                </div>
            )
        }
    }

    fetchPertemuan() {
        let localToken = localStorage.getItem('token');
        let config = {
            headers:
            {
                Authorization: `Bearer ${localToken}`
            }
        }

        axios.get('/pertemuan', config)
        .then(res => {
            let pertemuan = res.data.data;
            this.setState({pertemuan: pertemuan});
        })
        .catch(err => {
            if(err.response) {
                if(err.response.status === 404) {
                    this.setState({pertemuan: []});
                }
            }
        });
    }

    createPertemuan(e) {
        e.preventDefault();
        this.setState({error: {nama: null, tanggal: null, waktu: null}});

        if(this.state.nama && this.state.tanggal && this.state.waktu) {
            this.setState({createLoading: true});
            let localToken = localStorage.getItem('token');
            let config = {
                headers:
                {
                    Authorization: `Bearer ${localToken}`
                }
            }

            axios.post('/pertemuan', {
                nama: this.state.nama,
                tanggal: this.state.tanggal,
                waktu: this.state.waktu,
            }, config)
            .then(res => {
                let newPertemuan = res.data.data;
                let pertemuan = [];
                if(this.state.pertemuan) {
                    pertemuan = this.state.pertemuan;
                }

                pertemuan.push(newPertemuan);
                $('#createPertemuanModal').modal('hide');
                this.setState({pertemuan: pertemuan, nama: '', tanggal: '', waktu: '', createLoading: false});
            })
            .catch(err => {
                let errResponse = err.response;
                if(errResponse) {
                    if(errResponse.status === 400) {
                        let errMessage = {};
                        if(errResponse.data.errors.nama) {
                            errMessage['nama'] = errResponse.data.errors.nama[0];
                        }

                        if(errResponse.data.errors.tanggal) {
                            errMessage['tanggal'] = errResponse.data.errors.tanggal[0];
                        }

                        if(errResponse.data.errors.waktu) {
                            errMessage['waktu'] = errResponse.data.errors.waktu[0];
                        }

                        this.setState({error: errMessage, createLoading: false});
                    }
                } else {
                    this.setState({error: {nama: 'Telah terjadi kesalahan', tanggal: null, waktu: null}, createLoading: false});
                }
            });
        } else {
            let newState = {};
            if(!this.state.nama) {
                newState['nama'] = 'Nama pertemuan tidak boleh kosong';
            }

            if(!this.state.tanggal) {
                newState['tanggal'] = 'Tanggal tidak boleh kosong';
            }

            if(!this.state.waktu) {
                newState['waktu'] = 'Waktu tidak boleh kosong';
            }

            this.setState({error: newState});
        }
    }

    openModal() {
        $('#createPertemuanModal').modal('show');
    }

    componentDidMount() {
        $('#createPertemuanModal').modal('hide');
        $('.modal-backdrop').remove();
        this.fetchPertemuan();
    }

    render() {
        let content = '';

        if(this.state.pertemuan) {
            if(this.state.pertemuan.length > 0) {
                content = this.state.pertemuan.map(pertemuan => {
                    return (
                        <div className="col-md-3 mb-4" key={pertemuan.id}>
                            <div className={'card ' + style.pertemuanCard}>
                                <div className="card-header bg-primary text-white d-flex justify-content-between">
                                    <div>
                                        {pertemuan.nama}
                                    </div>
                                    <div>
                                        {pertemuan.kode_pertemuan}  
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="text-center">
                                        <h4>{ pertemuan.date_time }</h4>
                                    </div>
                                    <Link className="btn btn-primary w-100" to={'/guru/pertemuan/' + pertemuan.id}>Detail</Link>
                                </div>
                            </div>
                        </div>
                    );
                });
            } else {
                content = (
                    <div className="col-12">
                        <h5>Pertemuan tidak ditemukan.</h5>
                    </div>
                );
            }
        } else {
            let numOfCard = [1, 2, 3, 4];
            content = numOfCard.map(i => {
                return <div className="col-md-3 mb-4" key={i}>
                    <div className={'card ' + style.pertemuanSkeleton}>
                        <div className={'card-header py-3 ' + style.skeletonLoader}></div>
                        <div className="card-body">
                            <div className={'d-block py-2 w-50 mx-auto ' + style.skeletonLoader}></div>
                            <div className={'d-block py-3 mt-3 ' + style.skeletonLoader}></div>
                        </div>
                    </div>
                </div>;
            });
        }


        return (
            <div className="container-fluid">
                <div className={layoutStyle.contentTitle}>
                    <div>
                        Daftar Pertemuan
                    </div>
                    <button className="btn btn-primary px-4" onClick={this.openModal}>Buat Pertemuan</button>
                </div>
                <div className="row">
                    {
                        content
                    }
                </div>

                <div className="modal fade" tabIndex="-1" id="createPertemuanModal">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <form onSubmit={this.createPertemuan}>
                                <div className="modal-body">
                                    <h4 className="font-weight-bold">Buat Pertemuan</h4>
                                        <div className="form-group">
                                            <label>Nama pertemuan</label>
                                            <input className={"form-control" + (this.state.error.nama ? ' is-invalid' : '')} type="text" name="nama" placeholder="Nama pertemuan" onChange={this.handleInputChange}/>
                                            { this.showErrorMessage('nama') }
                                        </div>

                                        <div className="form-group">
                                            <label>Tanggal</label>
                                            <input className={"form-control" + (this.state.error.tanggal ? ' is-invalid' : '')} type="date" name="tanggal" placeholder="Nama pertemuan" onChange={this.handleInputChange}/>
                                            { this.showErrorMessage('tanggal') }
                                        </div>

                                        <div className="form-group">
                                            <label>Waktu</label>
                                            <input className={"form-control" + (this.state.error.waktu ? ' is-invalid' : '')} type="time" name="waktu" placeholder="Nama pertemuan" onChange={this.handleInputChange}/>
                                            { this.showErrorMessage('waktu') }
                                        </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" disabled={this.state.createLoading}>Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Pertemuan;