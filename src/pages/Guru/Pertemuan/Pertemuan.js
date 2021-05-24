import { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import BaseContext from '../../../BaseContext';
import axios from 'axios';

import layoutStyle from '../LayoutGuru.module.scss';
import style from './Pertemuan.module.scss';

class Pertemuan extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            pertemuan: null
        }

        this.fetchPertemuan = this.fetchPertemuan.bind(this);
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

    componentDidMount() {
        this.fetchPertemuan();
    }

    render() {
        let content = '';

        if(this.state.pertemuan) {
            if(this.state.pertemuan.length > 0) {
                content = this.state.pertemuan.map(pertemuan => {
                    let formatDate = new Date(`${pertemuan.tanggal} ${pertemuan.waktu}`);
                    let tanggal = `${formatDate.getDate()}/${formatDate.getMonth() + 1}/${formatDate.getFullYear()}`;
    
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
                                        <h4>{ tanggal }</h4>
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
                    Daftar Pertemuan
                </div>
                <div className="row">
                    {
                        content
                    }
                </div>
            </div>
        )
    }

}

export default Pertemuan;