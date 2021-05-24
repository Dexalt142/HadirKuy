import { Component } from 'react';
import { Link } from 'react-router-dom';
import BaseContext from '../../BaseContext';

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

    logout() {
        localStorage.removeItem('token');
        this.context.setBaseState('user_data', null);
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
                            <button className={style.navLink}>
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
            </div>
        )
    }

}

export default LayoutGuru;