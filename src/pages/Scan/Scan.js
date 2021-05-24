import { Component } from 'react';
import * as FaceAPI from 'face-api.js/';
import style from './Scan.module.scss';
import BaseContext from '../../BaseContext';
import { withRouter } from 'react-router-dom';
import FaceModel from '../../face_model.json';

import userImage from '../../assets/img/user.svg';

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
            faceFound: false
        };

        this.loadReferenceData = this.loadReferenceData.bind(this);
        this.startVideo = this.startVideo.bind(this);
        this.detectFace = this.detectFace.bind(this);
        this.loadDetector = this.loadDetector.bind(this);
        this.rescanButton = this.rescanButton.bind(this);
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
        const detection = await FaceAPI.detectSingleFace(this.videoFeed, new FaceAPI.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);

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

                        new FaceAPI.draw.DrawBox(
                            scaledDetection.detection.box,
                            {
                                boxColor: '#FFF',
                                lineWidth: 4
                            }
                        ).draw(this.canvas);

                        new FaceAPI.draw.DrawTextField(
                            texts,
                            bottomRight,
                            {
                                fontSize: 16,
                                fontStyle: 'Arial',
                                padding: 10
                            }
                        ).draw(this.canvas);
                    }

                }
    
                // FaceAPI.draw.drawDetections(this.canvas, scaledDetection);
                // FaceAPI.draw.drawFaceLandmarks(this.canvas, scaledDetection);

                // let boundingBox = new FaceAPI.draw.DrawBox(scaledDetection.detection.box, scaledDetection.detection.box.x, scaledDetection.detection.box.y, scaledDetection.detection.box.width, scaledDetection.detection.box.height);

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

                // clearInterval(this.detectInterval);
                // this.videoFeed.pause();

                // setTimeout(() => {
                //     this.setState({
                //         faceFound: true
                //     });
                // }, 1000);
            }
        }
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
        
            this.videoFeed.addEventListener("playing", () => {
                let videoWrapper = document.querySelector(`.${style.scannerVideoWrapper}`);
                this.canvas = FaceAPI.createCanvasFromMedia(this.videoFeed);
                this.canvas.id = style.scannerResult;
                videoWrapper.append(this.canvas);
        
                this.displaySize = {
                    width: this.videoFeed.getBoundingClientRect().width,
                    height: this.videoFeed.getBoundingClientRect().height
                };
                FaceAPI.matchDimensions(this.canvas, this.displaySize);
        
                this.detectInterval = setInterval(this.detectFace, 150);
            });
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
        this.props.history.push('/');
    }

    render() {
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
                                -
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
                                -
                            </div>
                        </div>

                        <div className={style.scannerContent}>
                            <img className={style.scannerImage} src={userImage}/>
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