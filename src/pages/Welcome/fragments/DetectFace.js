import { Component } from 'react';
import style from '../Welcome.module.scss';

class DetectFace extends Component {

    render() {
        return (
            <div className={style.container}>
                <div className={style.video_wrapper}>
                    <video id={style.source_video} autoPlay muted></video>
                </div>
            </div>
        )
    }

}

export default DetectFace;