import { Component } from 'react';
import BaseContext from '../../../BaseContext';
import axios from 'axios';

import layoutStyle from '../LayoutGuru.module.scss';
import style from './Siswa.module.scss';

import userImage from '../../../assets/img/user.svg';

class Siswa extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            siswa: null
        }

        this.fetchSiswa = this.fetchSiswa.bind(this);
    }

    fetchSiswa() {
        let localToken = localStorage.getItem('token');
        let config = {
            headers:
            {
                Authorization: `Bearer ${localToken}`
            }
        }

        axios.get('/siswa', config)
        .then(res => {
            let siswa = res.data.data;
            this.setState({siswa: siswa});
        })
        .catch(err => {
            if(err.response) {
                if(err.response.status === 404) {
                    this.setState({siswa: []});
                } else if (err.response.status === 401) {
                    this.context.revokeAuth();
                }
            }
        });
    }

    detailSiswa(e) {
        if(this.state.siswa || this.state.siswa.length > 0) {
            let targetSiswa = this.state.siswa[e];
            return this.props.history.push('/guru/siswa/' + targetSiswa.id);
        }
    }

    componentDidMount() {
        this.fetchSiswa();
    }

    render() {
        let content = '';

        if(this.state.siswa) {
            if(this.state.siswa.length > 0) {
                content = this.state.siswa.map((siswa, index) => {
                    return (
                        <div className="col-md-3 mb-4" key={siswa.id}>
                            <div className={'card ' + style.siswaCard}>
                                <div className={'card-body bg-primary ' + style.siswaCardBody}>
                                    <div className={style.pictureWrapper}>
                                        <img src={siswa.foto ? siswa.foto : userImage} alt={siswa.nama} />
                                        <div className={style.pictureOverlay}></div>
                                    </div>
                                    <div className={style.siswaContent}>
                                        <div className={style.siswaTitle}>
                                            { siswa.nis }
                                    </div>
                                        <div className={style.siswaSubtitle}>
                                            { siswa.nama }
                                    </div>
                                    </div>
                                </div>

                                <div className={style.siswaDetailContent} onClick={() => { this.detailSiswa(index) }}>
                                    <div className={style.siswaInfoGroup}>
                                        <div className={style.siswaInfoTitle}>
                                            NIS
                                        </div>

                                        <div className={style.siswaInfoSubTitle}>
                                            { siswa.nis }
                                        </div>
                                    </div>

                                    <div className={style.siswaInfoGroup}>
                                        <div className={style.siswaInfoTitle}>
                                            NAMA
                                        </div>

                                        <div className={style.siswaInfoSubTitle}>
                                            { siswa.nama }
                                        </div>
                                    </div>

                                    <div className={style.siswaInfoGroup}>
                                        <div className={style.siswaInfoTitle}>
                                            TTL
                                        </div>

                                        <div className={style.siswaInfoSubTitle}>
                                            { siswa.ttl }
                                        </div>
                                    </div>

                                    <div className={style.siswaInfoGroup}>
                                        <div className={style.siswaInfoTitle}>
                                            Jenis Kelamin
                                        </div>

                                        <div className={style.siswaInfoSubTitle}>
                                            { (siswa.jenis_kelamin === 'L') ? 'Laki-laki' : 'Perempuan' }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            } else {
                content = (
                    <div className="col-12">
                        <h5>Siswa tidak ditemukan.</h5>
                    </div>
                );
            }
        } else {
            let numOfCard = [1, 2, 3, 4];
            content = numOfCard.map(i => {
                return (
                    <div className="col-md-3 mb-4" key={i}>
                        <div className={'card ' + style.siswaSkeleton}>
                            <div className="card-body">
                                <div className={'d-block py-2 w-50 ' + style.skeletonLoader}></div>
                                <div className={'d-block py-2 mt-3 ' + style.skeletonLoader}></div>
                            </div>
                        </div>
                    </div>
                );
            });
        }

        return (
            <div className="container-fluid">
                <div className={layoutStyle.contentTitle}>
                    Daftar Siswa
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

export default Siswa;