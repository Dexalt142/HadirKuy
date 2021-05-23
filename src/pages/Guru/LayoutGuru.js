import { Component } from 'react';
import { Link } from 'react-router-dom';

import * as Feather from 'react-feather';
import style from './LayoutGuru.module.scss';

class LayoutGuru extends Component {

    isLinkActive(path) {
        if(path === window.location.pathname) {
            return ' ' + style.active;
        }

        return '';
    }

    render() {
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