import { Component } from 'react';
import * as FaceAPI from 'face-api.js/';
import style from './Scan.module.scss';
import BaseContext from '../../BaseContext';
import { withRouter } from 'react-router-dom';
import FaceModel from '../../face_model.json';

import userImage from '../../assets/img/user.svg';
import axios from 'axios';

class Scan extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.referenceData = null;
        this.videoFeed = null;
        this.canvas = null;
        this.displaySize = null;
        this.detectInterval = null;
        this.intervalTime = 200;
        this.state = {
            faceFound: false,
        };

        this.loadReferenceData = this.loadReferenceData.bind(this);
        this.startVideo = this.startVideo.bind(this);
        this.detectFace = this.detectFace.bind(this);
        this.videoListener = this.videoListener.bind(this);
        this.setVideoListener = this.setVideoListener.bind(this);
        this.loadDetector = this.loadDetector.bind(this);
        this.backToWelcome = this.backToWelcome.bind(this);
    }
    
    async loadReferenceData() {
        let referenceData = [];
        let faceModel = FaceModel;
        for(let i = 0; i < faceModel.length; i++) {
            referenceData.push(new FaceAPI.LabeledFaceDescriptors(faceModel[i].label, [new Float32Array(faceModel[i].descriptors[0])]));
        }

        this.referenceData = referenceData;
    }

    base64ToImage(base64, fileName) {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bin = atob(arr[1]);
        let binLength = bin.length;
        const u8 = new Uint8Array(binLength);
        while (binLength) {
            u8[binLength - 1] = bin.charCodeAt(binLength - 1);
            binLength -= 1;
        }

        return new File([u8], fileName, { type: mime });
    }

    startVideo() {
        if(navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({video: true})
            .then(stream => {
                this.videoFeed.srcObject = stream;
            })
            .catch(err => {
    
            });
        }
    }

    async detectFace() {
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);

        if(!this.state.faceFound) {
            const detection = await FaceAPI.detectSingleFace(this.videoFeed, new FaceAPI.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    
            if(detection) {
                const scaledDetection = FaceAPI.resizeResults(detection, this.displaySize);
                
                if(scaledDetection) {
                    if(scaledDetection.detection.score > 0.9) {
                        if(this.referenceData) {
                            const faceMatcher = new FaceAPI.FaceMatcher(this.referenceData, 0.4);
                            const result = faceMatcher.findBestMatch(scaledDetection.descriptor);

                            if(result.label !== 'unknown') {
                                clearInterval(this.detectInterval);
                                this.setState({faceFound: true});
                                this.videoFeed.pause();
                                this.canvas.getContext('2d').drawImage(this.videoFeed, (this.canvas.width / 6) * -1, 0, this.canvas.width + (this.canvas.width / 3), this.canvas.height);
    
                                const picture = this.base64ToImage(this.canvas.toDataURL('image/jpeg'), 'presensiImage');
                                let formData = new FormData();
                                formData.append('picture', picture, picture.name);
                                formData.append('pertemuan_id', this.context.baseState.pertemuan.id);
                                formData.append('siswa_uid', result.label);

                                await axios.post('/presensi', formData)
                                .then(res => {
                                    this.context.setBaseState('siswa', res.data.data.siswa);
                                    this.context.setBaseState('presensi', res.data.data.presensi); 
                                })
                                .catch(err => {
                                    this.videoFeed.play();
                                    this.setVideoListener();
                                    this.setState({ faceFound: false });
                                    this.detectInterval = setInterval(this.detectFace, this.intervalTime);
                                });
                            }

                        }
    
                    }
                }
            }
        }
    }

    videoListener() {
        let videoWrapper = document.querySelector(`.${style.scannerVideoWrapper}`);
        if(!this.canvas) {
            this.canvas = FaceAPI.createCanvasFromMedia(this.videoFeed);
            this.canvas.id = style.scannerResult;
            videoWrapper.append(this.canvas);
        }

        this.displaySize = {
            width: this.videoFeed.getBoundingClientRect().width,
            height: this.videoFeed.getBoundingClientRect().height
        };
        FaceAPI.matchDimensions(this.canvas, this.displaySize);

        this.detectInterval = setInterval(this.detectFace, this.intervalTime);
    }

    setVideoListener() {
        this.videoFeed.removeEventListener('playing', this.videoListener);
        this.videoFeed.addEventListener("playing", this.videoListener);
    }

    loadDetector() {
        if(!this.state.faceFound) {
            this.videoFeed = document.querySelector(`#${style.scannerVideoSource}`);
            Promise.all([
                FaceAPI.loadTinyFaceDetectorModel('/models'),
                FaceAPI.loadFaceLandmarkModel('/models'),
                FaceAPI.loadMtcnnModel('/models'),
                FaceAPI.loadFaceRecognitionModel('/models')
            ]).then(async () => {
                await this.loadReferenceData();
                this.startVideo();
            });
        
            this.setVideoListener();
        }
    }

    backToWelcome() {
        clearInterval(this.detectInterval);
        this.context.setBaseState('pertemuan', null);
        this.context.setBaseState('siswa', null);
        this.context.setBaseState('presensi', null);
        this.props.history.push('/');
    }

    componentDidMount() {
        if(!this.context.baseState.pertemuan) {
            return this.props.history.push('/');
        }

        if(this.context.baseState.pertemuan && this.context.baseState.presensi) {
            
        }

        this.loadDetector();

    }

    componentWillUnmount() {
        if (this.videoFeed) {
            this.videoFeed.srcObject.getTracks().forEach(track => {
                track.stop();
            });
        }
    }

    render() {
        let time = null;
        if(this.context.baseState.presensi) {
            let curr = new Date(`${this.context.baseState.presensi.tanggal} ${this.context.baseState.presensi.waktu}`);
            time = `${curr.getDate()}-${curr.getMonth() + 1}-${curr.getFullYear()} ${curr.getHours()}:${curr.getMinutes()}`;
        }

        return (
            <div className={"container " + style.container}>
                <div className={style.scanTitle}>
                    HadirKuy
                </div>
                <div className={style.scanSubtitle}>
                    Sistem Presensi Siswa Menggunakan Face Recognition
                </div>

                <div className="row mt-5">
                    <div className="col-md-6">
                        <div className={style.scannerHeader}>
                            <div className={style.scannerTitle}>
                                Tanggal dan Waktu
                            </div>
                            <div className={style.scannerSubtitle}>
                                { time ? time : '-' }
                            </div>
                        </div>

                        <div className={style.scannerContent}>
                            <div className={style.scannerVideoWrapper}>
                                <video id={style.scannerVideoSource} autoPlay muted></video>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className={style.scannerHeader}>
                            <div className={style.scannerTitle}>
                                Data Siswa
                            </div>
                            <div className={style.scannerSubtitle}>
                                { this.context.baseState.siswa ? this.context.baseState.siswa.nama : '-' }
                            </div>
                        </div>

                        <div className={style.scannerContent}>
                            <img className={style.scannerImage} src={this.context.baseState.siswa ? this.context.baseState.siswa.foto : userImage}/>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12 d-flex justify-content-around">
                        {
                            (this.context.baseState.presensi && this.context.baseState.siswa)
                            ? <button className="btn btn-lg btn-primary px-5">Lihat Rekap</button>
                            : null
                        }
                        <button className="btn btn-lg btn-primary-inverse px-5" onClick={this.backToWelcome}>Tutup</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Scan);