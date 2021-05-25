import { Component } from 'react';
import axios from 'axios';

import layoutStyle from '../../LayoutGuru.module.scss';
import style from './PertemuanDetail.module.scss';

class PertemuanDetail extends Component {

    constructor(props) {
        super(props);
        this.pertemuanId = this.props.match.params.id;
        this.state = {
            pertemuan: null
        };

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

        axios.get('/pertemuan/detail/' + this.pertemuanId, config)
        .then(res => {
            let pertemuan = res.data.data;
            this.setState({pertemuan: pertemuan});
        })
        .catch(err => {
        });
    }

    componentDidMount() {
        this.fetchPertemuan();
    }

    render() {
        let content = '';

        if(this.state.pertemuan) {
            const present = this.state.pertemuan.presensi.present.length;
            const absent = this.state.pertemuan.presensi.absent.length;
            const total = present + absent;

            content = (
                <div>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className={'card ' + style.infoCard}>
                                <div className="card-body">
                                    <div className={style.infoCardTitle}>
                                        { total }
                                    </div>
                                    <div className={style.infoCardSubtitle}>
                                        Jumlah Siswa
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className={'card ' + style.infoCard}>
                                <div className="card-body">
                                    <div className={style.infoCardTitle}>
                                        { present }
                                    </div>
                                    <div className={style.infoCardSubtitle}>
                                        Siswa Hadir
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className={'card ' + style.infoCard}>
                                <div className="card-body">
                                    <div className={style.infoCardTitle}>
                                        { absent }
                                    </div>
                                    <div className={style.infoCardSubtitle}>
                                        Siswa Tidak Hadir
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-4 mb-5">
                            <h4>Siswa Hadir</h4>
                            <div className="card">
                                <div className="table-responsive">
                                    <table className="table table-hover table-striped mb-0">
                                        <thead>
                                            <th>NIS</th>
                                            <th>Nama</th>
                                            <th>Waktu</th>
                                            <th>Aksi</th>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.pertemuan.presensi.present.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{ data.siswa.nis }</td>
                                                        <td>{ data.siswa.nama }</td>
                                                        <td>{ data.presensi.date_time }</td>
                                                        <td><button type="button" className="btn btn-primary btn-sm">Detail</button></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <h4>Siswa Tidak Hadir</h4>
                            <div className="card">
                                <div className="table-responsive">
                                    <table className="table table-hover table-striped mb-0">
                                        <thead>
                                            <th>NIS</th>
                                            <th>Nama</th>
                                            <th>Aksi</th>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.pertemuan.presensi.absent.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{data.siswa.nis}</td>
                                                        <td>{data.siswa.nama}</td>
                                                        <td><button type="button" className="btn btn-primary btn-sm">Detail</button></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            content = (
                <div className="row">

                </div>
            );
        }

        return (
            <div className='container-fluid'>
                {
                    (this.state.pertemuan) ? 
                    <div className={layoutStyle.contentTitle}>
                        { this.state.pertemuan.nama }
                        <div className={layoutStyle.contentSubtitle}>
                            { this.state.pertemuan.kode_pertemuan + ' - ' + this.state.pertemuan.date_time }
                        </div>
                    </div>
                    : 
                    <div className={style.pertemuanSkeleton + ' mt-3 w-25'}>
                        <span className={style.skeletonLoader + ' d-block w-100 py-3'}></span>
                        <span className={style.skeletonLoader + ' d-block w-50 mt-3 py-2'}></span>
                    </div>
                }
                
                {
                    content
                }
            </div>
        );
    }
}

export default PertemuanDetail;