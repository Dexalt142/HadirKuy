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
        this.state = {
            sendingResult: false,
            faceFound: false,
            presensi: null,
            siswa: null,
        };

        this.loadReferenceData = this.loadReferenceData.bind(this);
        this.startVideo = this.startVideo.bind(this);
        this.detectFace = this.detectFace.bind(this);
        this.loadDetector = this.loadDetector.bind(this);
        this.rescanButton = this.rescanButton.bind(this);
        this.backToWelcome = this.backToWelcome.bind(this);
        this.setVideoListener = this.setVideoListener.bind(this);
        this.videoListener = this.videoListener.bind(this);
    }

    async loadReferenceData() {
        let referenceData = [];
        let faceModel = FaceModel;
        for(let i = 0; i < faceModel.length; i++) {
            referenceData.push(new FaceAPI.LabeledFaceDescriptors(faceModel[i].label, [new Float32Array(faceModel[i].descriptors[0])]));
        }

        this.referenceData = referenceData;
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
                    const bottomRight = {
                        x: scaledDetection.detection.box.bottomLeft.x - 2,
                        y: scaledDetection.detection.box.bottomLeft.y + 2
                    };
                    const date = `${new Date().toLocaleDateString()}`;
                    const time = `${new Date().toLocaleTimeString()}`;
                    let texts = [
                        `Confidence: ${(scaledDetection.detection.score * 100).toFixed(1)}%`,
                        // `Tanggal: ${date}`,
                        // `Waktu: ${time}`
                    ];
    
                    if(scaledDetection.detection.score > 0.9) {
                        if(this.referenceData) {
                            const faceMatcher = new FaceAPI.FaceMatcher(this.referenceData, 0.4);
    
                            const result = faceMatcher.findBestMatch(scaledDetection.descriptor);
    
                            texts.push(result.toString());
    
                            // new FaceAPI.draw.DrawBox(
                            //     scaledDetection.detection.box,
                            //     {
                            //         boxColor: '#FFF',
                            //         lineWidth: 4
                            //     }
                            // ).draw(this.canvas);
    
                            // new FaceAPI.draw.DrawTextField(
                            //     texts,
                            //     bottomRight,
                            //     {
                            //         fontSize: 16,
                            //         fontStyle: 'Arial',
                            //         padding: 10
                            //     }
                            // ).draw(this.canvas);

                            if(result.label !== 'unknown') {
                                clearInterval(this.detectInterval);
                                this.setState({faceFound: true});
                                this.videoFeed.pause();
    
                                const postresult = await axios.post('/presensi', {
                                    pertemuan_id: this.context.baseState.pertemuan.id,
                                    siswa_uid: result.label
                                })
                                .then(res => {
                                    this.context.setBaseState('siswa', res.data.data.siswa);
                                    this.context.setBaseState('presensi', res.data.data.presensi);
                                })
                                .catch(err => {
                                    this.videoFeed.play();
                                    this.setVideoListener();
                                    this.setState({ faceFound: false });
                                    this.detectInterval = setInterval(this.detectFace, 150);
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

        this.detectInterval = setInterval(this.detectFace, 150);
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

    rescanButton() {
        this.setState({
            faceFound: false
        });
        setTimeout(() => {
            this.loadDetector();
        }, 1000);
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
        // if(this.videoFeed) {
        //     this.videoFeed.getTracks().forEach(track => {
        //         track.stop();
        //     });
        // }
        clearInterval(this.detectInterval);
    }

    backToWelcome() {
        this.context.setBaseState('pertemuan', null);
        this.context.setBaseState('siswa', null);
        this.context.setBaseState('presensi', null);
        this.props.history.push('/');
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
                    <div className="col-md-6 d-flex justify-content-center">
                        <button className="btn btn-lg btn-primary px-5">Lihat Rekap</button>
                    </div>

                    <div className="col-md-6 d-flex justify-content-center">
                        <button className="btn btn-lg btn-primary-inverse px-5" onClick={this.backToWelcome}>Tutup</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Scan);