import { Component } from 'react';
import BaseContext from '../../BaseContext';
import axios from 'axios';

import $ from 'jquery';
import style from './RekapPresensi.module.scss';

class RekapPresensi extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            presensi: null,
            presensiDetail: null
        };

        this.fetchRekapPresensi = this.fetchRekapPresensi.bind(this);
        this.openDetailModal = this.openDetailModal.bind(this);
        this.backToWelcome = this.backToWelcome.bind(this);
    }

    fetchRekapPresensi() {
        axios.get('/rekap/' + this.context.baseState.siswa.id)
        .then(res => {
            let presensi = res.data.data;
            this.setState({ presensi: presensi });
        })
        .catch(err => {
        });
    }

    openDetailModal(index) {
        this.setState({presensiDetail: this.state.presensi[index]}, () => {
            $('#detailModal').modal('show');
        });
    }

    backToWelcome() {
        clearInterval(this.detectInterval);
        this.context.setBaseState('pertemuan', null);
        this.context.setBaseState('siswa', null);
        this.context.setBaseState('presensi', null);
        return this.props.history.push('/');
    }

    componentDidMount() {
        if(!this.context.baseState.pertemuan || !this.context.baseState.siswa) {
            return this.props.history.push('/');
        }

        $('#detailModal').modal('hide');
        $('.modal-backdrop').remove();


        this.fetchRekapPresensi();

        $('#detailModal').on('hidden.bs.modal', () => {
            this.setState({ presensiDetail: null });
        });
    }

    componentWillUnmount() {
        $('#detailModal').modal('hide');
        $('.modal-backdrop').remove();
    }

    render() {
        let modalContent = '';
        if(this.state.presensiDetail) {
            modalContent = (
                <div className={style.modalContent}>
                    <div className={style.modalInfoGroup}>
                        <div className={style.modalInfoTitle}>
                            Nama Pertemuan
                        </div>
                        <div className={style.modalInfoSubtitle}>
                            { this.state.presensiDetail.pertemuan.nama }
                        </div>
                    </div>

                    <div className={style.modalInfoGroup}>
                        <div className={style.modalInfoTitle}>
                            Jadwal Pertemuan
                        </div>
                        <div className={style.modalInfoSubtitle}>
                            { this.state.presensiDetail.pertemuan.date_time }
                        </div>
                    </div>

                    <div className={style.modalInfoGroup}>
                        <div className={style.modalInfoTitle}>
                            Waktu Isi Presensi
                        </div>
                        <div className={style.modalInfoSubtitle}>
                            { this.state.presensiDetail.date_time }
                            <div className={'badge ml-2 ' + (this.state.presensiDetail.status === 'Tepat Waktu' ? 'badge-success' : 'badge-danger')}>{ this.state.presensiDetail.status }</div>
                        </div>
                    </div>

                    <div className={style.modalInfoGroup}>
                        <div className={style.modalInfoTitle}>
                            Bukti Isi Presensi
                        </div>
                        <div className={style.modalInfoImage}>
                            <img src={ this.state.presensiDetail.foto } alt='Bukti presensi' />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={'container ' + style.container}>
                <div className={style.containerTitle}>
                    HadirKuy
                </div>
                <div className={style.containerSubtitle}>
                    Sistem Presensi Siswa Menggunakan Face Recognition
                </div>

                <div className="row mt-5">
                    <div className="col-12 d-flex justify-content-around">
                        <div className={style.siswaInfo}>
                            <div className={style.siswaInfoGroup}>
                                <div className={style.infoTitle}>
                                    Nama
                                </div>

                                <div className={style.infoSubtitle}>
                                    { this.context.baseState.siswa ? this.context.baseState.siswa.nama : '' }
                                </div>
                            </div>
                        </div>

                        <div className={style.siswaInfo}>
                            <div className={style.siswaInfoGroup}>
                                <div className={style.infoTitle}>
                                    NIS
                                </div>

                                <div className={style.infoSubtitle}>
                                    { this.context.baseState.siswa ? this.context.baseState.siswa.nis : '' }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-4">
                        <div className="table-responsive">
                            <table className="table table-hover table-striped mb-0">
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
                                        (this.state.presensi && this.state.presensi.length > 0) ?
                                        this.state.presensi.map((presensi, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{ presensi.pertemuan.nama }</td>
                                                    <td>{ presensi.pertemuan.date_time }</td>
                                                    <td><div className={"badge " + (presensi.status === 'Tepat Waktu' ? 'badge-success' : 'badge-danger')}>{presensi.status}</div></td>
                                                    <td><button className="btn btn-sm btn-primary" onClick={() => {this.openDetailModal(index)}}>Detail</button></td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan='4'>
                                                <h5 className="text-center">Pertemuan tidak ditemukan</h5>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex justify-content-center mt-4">
                            <button className="btn btn-primary px-5" onClick={this.backToWelcome}>Tutup</button>
                        </div>
                    </div>
                </div>
                
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
        )
    }

}

export default RekapPresensi;