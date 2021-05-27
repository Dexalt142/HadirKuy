import { Component } from 'react';
import axios from 'axios';
import BaseContext from '../../../../BaseContext';
import layoutStyle from '../../LayoutGuru.module.scss';
import style from './PertemuanDetail.module.scss';
import $ from 'jquery';

import StatsCard from '../../../../assets/components/StatsCard/StatsCard';

class PertemuanDetail extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.pertemuanId = this.props.match.params.id;
        this.fetchInterval = null;
        this.state = {
            pertemuan: null,
            detailPresensi: null,
            detailSiswa: null
        };

        this.fetchPertemuan = this.fetchPertemuan.bind(this);
        this.detailPresensi = this.detailPresensi.bind(this);
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

            if(!this.fetchInterval) {
                this.fetchInterval = setInterval(this.fetchPertemuan, 5000);
            }
        })
        .catch(err => {
            if(err.response) {
                if(err.response.status === 404) {
                    return this.props.history.push('/guru/pertemuan');
                } else if (err.response.status === 401) {
                    this.context.revokeAuth();
                }
            }
        });
    }

    componentWillUnmount() {
        if(this.fetchInterval) {
            clearInterval(this.fetchInterval);
            this.fetchInterval = null;
        }
    }

    detailPresensi(type, index) {
        this.setState({ detailPresensi: this.state.pertemuan.presensi[type][index]}, () => {
            $('#detailModal').modal('toggle');
        });
    }

    detailSiswa(index) {
        this.setState({detailSiswa: this.state.pertemuan.presensi['absent'][index].siswa}, () => {
            $('#detailModal').modal('toggle');
        });
    }

    componentDidMount() {
        $('#detailModal').modal('hide');
        $('.modal-backdrop').remove();
        $('#detailModal').on('hidden.bs.modal', () => {
            this.setState({detailSiswa: null, detailPresensi: null});
        });

        this.fetchPertemuan();
    }

    render() {
        let content = '';
        let modalContent = '';

        if(this.state.pertemuan) {
            const present = this.state.pertemuan.presensi.present.length;
            const late = this.state.pertemuan.presensi.late.length;
            const absent = this.state.pertemuan.presensi.absent.length;
            const total = present + late + absent;

            content = (
                <div>
                    <div className="row">
                        <div className="col-md-3 mb-4">
                            <StatsCard title='Jumlah Siswa' value={total}/>
                        </div>

                        <div className="col-md-3 mb-4">
                            <StatsCard title='Siswa Tepat Waktu' value={present} />
                        </div>

                        <div className="col-md-3 mb-4">
                            <StatsCard title='Siswa Terlambat' value={late} />
                        </div>

                        <div className="col-md-3 mb-4">
                            <StatsCard title='Siswa Tidak Hadir' value={absent} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-4 mb-5">
                            <h4>Siswa Hadir</h4>
                            <div className="card">
                                <div className="table-responsive">
                                    <table className="table table-hover table-striped mb-0">
                                        <thead>
                                            <tr>
                                                <th>NIS</th>
                                                <th>Nama</th>
                                                <th>Waktu</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.pertemuan.presensi.present.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{ data.siswa.nis }</td>
                                                        <td>{ data.siswa.nama }</td>
                                                        <td>{ data.presensi.date_time } <div className="badge badge-success">{ data.presensi.status }</div></td>
                                                        <td><button type="button" className="btn btn-primary btn-sm" onClick={() => { this.detailPresensi('present', index) }}>Detail</button></td>
                                                    </tr>
                                                ))
                                            }
                                            {
                                                this.state.pertemuan.presensi.late.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{ data.siswa.nis }</td>
                                                        <td>{ data.siswa.nama }</td>
                                                        <td>{ data.presensi.date_time } <div className="badge badge-danger">{ data.presensi.status }</div></td>
                                                        <td><button type="button" className="btn btn-primary btn-sm" onClick={() => { this.detailPresensi('late', index) }}>Detail</button></td>
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
                                            <tr>
                                                <th>NIS</th>
                                                <th>Nama</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.pertemuan.presensi.absent.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{data.siswa.nis}</td>
                                                        <td>{data.siswa.nama}</td>
                                                        <td><button type="button" className="btn btn-primary btn-sm" onClick={() => { this.detailSiswa(index) }}>Detail</button></td>
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

        if(this.state.detailPresensi) {
            modalContent = (
                <div className={layoutStyle.modalContent}>
                    <div className={layoutStyle.modalInfoGroup}>
                        <div className={layoutStyle.modalInfoTitle}>
                            Nama
                        </div>
                        <div className={layoutStyle.modalInfoSubtitle}>
                            { this.state.detailPresensi.siswa.nama }
                        </div>
                    </div>

                    <div className={layoutStyle.modalInfoGroup}>
                        <div className={layoutStyle.modalInfoTitle}>
                            NIS
                        </div>
                        <div className={layoutStyle.modalInfoSubtitle}>
                            { this.state.detailPresensi.siswa.nis }
                        </div>
                    </div>

                    <div className={layoutStyle.modalInfoGroup}>
                        <div className={layoutStyle.modalInfoTitle}>
                            Tanggal Isi Presensi
                        </div>
                        <div className={layoutStyle.modalInfoSubtitle}>
                            { this.state.detailPresensi.presensi.date_time }
                            <div className={"badge ml-2 " + (this.state.detailPresensi.presensi.status === 'Terlambat' ? 'badge-danger' : 'badge-success')}>{ this.state.detailPresensi.presensi.status }</div>
                        </div>
                    </div>

                    <div className={layoutStyle.modalInfoGroup}>
                        <div className={layoutStyle.modalInfoTitle}>
                            Foto Siswa
                        </div>
                        <div className={layoutStyle.modalInfoImage}>
                            <img src={this.state.detailPresensi.siswa.foto} />
                        </div>
                    </div>

                    <div className={layoutStyle.modalInfoGroup}>
                        <div className={layoutStyle.modalInfoTitle}>
                            Bukti Isi Presensi
                        </div>
                        <div className={layoutStyle.modalInfoImage}>
                            <img src={this.state.detailPresensi.presensi.foto} />
                        </div>
                    </div>

                </div>
            );
        } else if(this.state.detailSiswa) {
            modalContent = (
                <div className={layoutStyle.modalContent}>
                    <div className={layoutStyle.modalInfoGroup}>
                        <div className={layoutStyle.modalInfoTitle}>
                            Nama
                        </div>
                        <div className={layoutStyle.modalInfoSubtitle}>
                            {this.state.detailSiswa.nama}
                        </div>
                    </div>

                    <div className={layoutStyle.modalInfoGroup}>
                        <div className={layoutStyle.modalInfoTitle}>
                            NIS
                        </div>
                        <div className={layoutStyle.modalInfoSubtitle}>
                            {this.state.detailSiswa.nis}
                        </div>
                    </div>

                    <div className={layoutStyle.modalInfoGroup}>
                        <div className={layoutStyle.modalInfoTitle}>
                            Foto Siswa
                        </div>
                        <div className={layoutStyle.modalInfoImage}>
                            <img src={this.state.detailSiswa.foto} />
                        </div>
                    </div>
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

                <div className="modal fade" tabIndex="-1" id="detailModal">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-body">
                                { modalContent }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PertemuanDetail;