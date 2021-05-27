import { Component } from 'react';
import { Link } from 'react-router-dom';
import BaseContext from '../../BaseContext';

import $ from 'jquery';
import * as Feather from 'react-feather';
import style from './LayoutGuru.module.scss';

class LayoutGuru extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    isLinkActive(path) {
        let pathName = window.location.pathname;
        if(path === '/guru' && pathName === '/guru') {
            return ' ' + style.active;
        }

        if(path === pathName.substring(0, path.length) && path !== '/guru') {
            return ' ' + style.active;
        }


        return '';
    }

    openProfileModal() {
        $('#profileModal').modal('show');
    }

    logout() {
        localStorage.removeItem('token');
        this.context.setBaseState('user_data', null);
    }

    componentDidMount() { 
        $('#profileModal').modal('hide');
        $('.modal-backdrop').remove();
    }
    
    render() {
        let dataGuru = {nama: 'Memuat'};
        if (this.context.baseState.user_data) {
            dataGuru = this.context.baseState.user_data;
        }

        return (
            <div className={style.layoutContainer}>
                <div className={style.sidebarContainer}>
                    <nav className={style.sidebar}>
                        <div>
                            <Link to={'/guru'} className={style.navBrand}>HadirKuy</Link>

                            <div className={style.navList}>
                                <Link to={'/guru'} className={style.navLink + this.isLinkActive('/guru')}>
                                    <Feather.Grid/>
                                    <span className={style.navTitle}>Dashboard</span>
                                </Link>

                                <Link to={'/guru/siswa'} className={style.navLink + this.isLinkActive('/guru/siswa')}>
                                    <Feather.Users/>
                                    <span className={style.navTitle}>Daftar Siswa</span>
                                </Link>

                                <Link to={'/guru/pertemuan'} className={style.navLink + this.isLinkActive('/guru/pertemuan')}>
                                    <Feather.Layers/>
                                    <span className={style.navTitle}>Daftar Pertemuan</span>
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button className={style.navLink} onClick={this.openProfileModal}>
                                <Feather.User/>
                                <span className={style.navTitle}>{ dataGuru.nama }</span>
                            </button>
                            <button className={style.navLink} onClick={this.logout}>
                                <Feather.Power/>
                                <span className={style.navTitle}>Keluar</span>
                            </button>
                        </div>

                    </nav>

                </div>

                <div className={style.contentContainer}>

                    { this.props.children }
                </div>

                <div className="modal fade" tabIndex="-1" id="profileModal">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-body">
                                {
                                    dataGuru ?
                                    <div className={style.modalContent}>
                                        <div className={style.modalInfoGroup}>
                                            <div className={style.modalInfoTitle}>
                                                Nama
                                            </div>
                                            <div className={style.modalInfoSubtitle}>
                                                { dataGuru.nama }
                                            </div>
                                        </div>

                                        <div className={style.modalInfoGroup}>
                                            <div className={style.modalInfoTitle}>
                                                NIP
                                            </div>
                                            <div className={style.modalInfoSubtitle}>
                                                { dataGuru.nip }
                                            </div>
                                        </div>

                                        <div className={style.modalInfoGroup}>
                                            <div className={style.modalInfoTitle}>
                                                Email
                                            </div>
                                            <div className={style.modalInfoSubtitle}>
                                                { dataGuru.email }
                                            </div>
                                        </div>

                                        <div className={style.modalInfoGroup}>
                                            <div className={style.modalInfoTitle}>
                                                Mata Pelajaran
                                            </div>
                                            <div className={style.modalInfoSubtitle}>
                                                { dataGuru.mata_pelajaran }
                                            </div>
                                        </div>

                                    </div>
                                    : ''
                                }
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

export default LayoutGuru;