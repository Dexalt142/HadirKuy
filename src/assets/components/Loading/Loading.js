import { Component } from 'react';
import style from './Loading.module.scss';

class Loading extends Component {

    render() {
        return (
            <div className={style.container}>
                <div className={style.wrapper}>
                    <div className={style.spinner}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <span className={style.title}>Memuat</span>
                </div>
            </div>
        );
    }

}

export default Loading;