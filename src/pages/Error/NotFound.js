import { Component } from 'react';
import style from './NotFound.module.scss';

class NotFound extends Component {
    render() {
        return (
            <div className={style.container}>
                <div className={style.notFoundEmoji}>
                    ¯\_(ツ)_/¯
                </div>

                <div className={style.notFoundTitle}>
                    Halaman yang anda cari tidak dapat ditemukan.
                </div>
            </div>
        );
    }
}

export default NotFound;