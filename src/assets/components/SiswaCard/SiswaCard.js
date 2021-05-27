import { Component } from 'react';
import style from './SiswaCard.module.scss';
import userImage from '../../../assets/img/user.svg';

class SiswaCard extends Component {

    constructor(props) {
        super(props);

        this.detailSiswa = this.detailSiswa.bind(this);
    }

    detailSiswa() {
        return this.props.history.push('/guru/siswa/' + this.props.siswa.id);
    }

    render() {
        let siswa = this.props.siswa;

        return (
            <div className={'card ' + style.siswaCard}>
                <div className={'card-body bg-primary ' + style.siswaCardBody}>
                    <div className={style.pictureWrapper}>
                        <img src={siswa.foto ? siswa.foto : userImage} alt={siswa.nama} />
                        <div className={style.pictureOverlay}></div>
                    </div>
                    <div className={style.siswaContent}>
                        <div className={style.siswaTitle}>
                            {siswa.nis}
                        </div>
                        <div className={style.siswaSubtitle}>
                            {siswa.nama}
                        </div>
                    </div>
                </div>

                <div className={style.siswaDetailContent} onClick={this.detailSiswa}>
                    <div className={style.siswaInfoGroup}>
                        <div className={style.siswaInfoTitle}>
                            NIS
                        </div>

                        <div className={style.siswaInfoSubTitle}>
                            {siswa.nis}
                        </div>
                    </div>

                    <div className={style.siswaInfoGroup}>
                        <div className={style.siswaInfoTitle}>
                            NAMA
                        </div>

                        <div className={style.siswaInfoSubTitle}>
                            {siswa.nama}
                        </div>
                    </div>

                    <div className={style.siswaInfoGroup}>
                        <div className={style.siswaInfoTitle}>
                            TTL
                        </div>

                        <div className={style.siswaInfoSubTitle}>
                            {siswa.ttl}
                        </div>
                    </div>

                    <div className={style.siswaInfoGroup}>
                        <div className={style.siswaInfoTitle}>
                            Jenis Kelamin
                        </div>

                        <div className={style.siswaInfoSubTitle}>
                            {(siswa.jenis_kelamin === 'L') ? 'Laki-laki' : 'Perempuan'}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default SiswaCard;