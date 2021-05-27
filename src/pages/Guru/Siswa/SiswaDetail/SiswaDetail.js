import { Component } from 'react';
import axios from 'axios';

import $ from 'jquery';
import layoutStyle from '../../LayoutGuru.module.scss';
import style from './SiswaDetail.module.scss';

class SiswaDetail extends Component {

    constructor(props) {
        super(props);
        this.siswaId = this.props.match.params.id;
        this.state = {
            siswa: null,
            presensi: null
        };

        this.fetchSiswa = this.fetchSiswa.bind(this);
        this.detailModal = this.detailModal.bind(this);
    }

    fetchSiswa() {
        let localToken = localStorage.getItem('token');
        let config = {
            headers:
            {
                Authorization: `Bearer ${localToken}`
            }
        }

        axios.get('/siswa/' + this.siswaId, config)
        .then(res => {
            let siswa = res.data.data;
            this.setState({ siswa: siswa });
        })
        .catch(err => {
            if (err.response) {
                if (err.response.status === 404) {
                    return this.props.history.push('/guru/siswa');
                }
            }
        });
    }

    detailModal(index) {
        this.setState({presensi: this.state.siswa.presensi[index]}, () => {
            $('#detailModal').modal('show');
        });
    }

    componentDidMount() {
        $('#detailModal').modal('hide');
        $('.modal-backdrop').remove();
        this.fetchSiswa();

        $('#detailModal').on('hidden.bs.modal', () => {
            this.setState({ presensi: null});
        });
    }

    render() {
        let content = '';
        let modalContent = '';

        if(this.state.siswa) {
            content = (
                <div className="row">
                    <div className="col-lg-3">
                        <div className={"card " + style.infoCard}>
                            <div className="card-body">
                                <div className={style.infoCardGroup}>
                                    <div className={style.infoCardImage}>
                                        <img src={this.state.siswa.foto} alt={this.state.siswa.name} />
                                    </div>
                                </div>

                                <div className={style.infoCardGroup}>
                                    <div className={style.infoCardTitle}>
                                        NIS
                                    </div>
                                    <div className={style.infoCardSubtitle}>
                                        { this.state.siswa.nis }
                                    </div>
                                </div>

                                <div className={style.infoCardGroup}>
                                    <div className={style.infoCardTitle}>
                                        Nama
                                    </div>
                                    <div className={style.infoCardSubtitle}>
                                        { this.state.siswa.nama }
                                    </div>
                                </div>

                                <div className={style.infoCardGroup}>
                                    <div className={style.infoCardTitle}>
                                        Tempat Tanggal Lahir
                                    </div>
                                    <div className={style.infoCardSubtitle}>
                                        { this.state.siswa.ttl }
                                    </div>
                                </div>

                                <div className={style.infoCardGroup}>
                                    <div className={style.infoCardTitle}>
                                        Jenis Kelamin
                                    </div>
                                    <div className={style.infoCardSubtitle}>
                                        { this.state.siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }
                                    </div>
                                </div>

                                <div className={style.infoCardGroup}>
                                    <div className={style.infoCardTitle}>
                                        Alamat
                                    </div>
                                    <div className={style.infoCardSubtitle}>
                                        { this.state.siswa.alamat }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Nama Pertemuan</th>
                                                    <th>Jadwal Pertemuan</th>
                                                    <th>Status</th>
                                                    <th>Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (this.state.siswa.presensi.length < 1) ?
                                                    <tr>
                                                        <td colSpan='4'>
                                                            <h5 className="text-center">Pertemuan tidak ditemukan</h5>
                                                        </td>
                                                    </tr>
                                                    :
                                                    this.state.siswa.presensi.map((presensi, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{ presensi.pertemuan.nama }</td>
                                                                <td>{ presensi.pertemuan.date_time }</td>
                                                                <td><div className={"badge " + (presensi.status === 'Tepat Waktu' ? 'badge-success' : 'badge-danger')}>{ presensi.status }</div></td>
                                                                <td><button className="btn btn-sm btn-primary" onClick={() => { this.detailModal(index) }}>Detail</button></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            );
        }

        if(this.state.presensi) {
            modalContent = (
                <div className={style.modalContent}>
                    <div className={style.modalInfoGroup}>
                        <div className={style.modalInfoTitle}>
                            Nama Pertemuan
                        </div>
                        <div className={style.modalInfoSubtitle}>
                            { this.state.presensi.pertemuan.nama }
                        </div>
                    </div>

                    <div className={style.modalInfoGroup}>
                        <div className={style.modalInfoTitle}>
                            Jadwal Pertemuan
                        </div>
                        <div className={style.modalInfoSubtitle}>
                            { this.state.presensi.pertemuan.date_time }
                        </div>
                    </div>

                    <div className={style.modalInfoGroup}>
                        <div className={style.modalInfoTitle}>
                            Waktu Isi Presensi
                        </div>
                        <div className={style.modalInfoSubtitle}>
                            { this.state.presensi.date_time }
                            <div className={'badge ml-2 ' + (this.state.presensi.status === 'Tepat Waktu' ? 'badge-success' : 'badge-danger')}>{ this.state.presensi.status }</div>
                        </div>
                    </div>

                    <div className={style.modalInfoGroup}>
                        <div className={style.modalInfoTitle}>
                            Bukti Isi Presensi
                        </div>
                        <div className={style.modalInfoImage}>
                            <img src={this.state.presensi.foto} alt='Bukti presensi'/>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="container-fluid">
                {
                    (this.state.siswa) ?
                    <div className={layoutStyle.contentTitle}>
                        {this.state.siswa.nama}
                        <div className={layoutStyle.contentSubtitle}>
                            {this.state.siswa.nis }
                        </div>
                    </div>
                    :
                    <div className={style.siswaSkeleton + ' mt-3 w-25'}>
                        <span className={style.skeletonLoader + ' d-block w-100 py-3'}></span>
                        <span className={style.skeletonLoader + ' d-block w-50 mt-3 py-2'}></span>
                    </div>
                }

                { content }

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

export default SiswaDetail;