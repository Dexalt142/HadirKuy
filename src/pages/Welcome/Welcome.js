import { Component } from 'react';
import * as FaceAPI from 'face-api.js/';
import style from './Welcome.module.scss';

class Welcome extends Component {

    constructor(props) {
        super(props);
        this.videoFeed = null;
        this.canvas = null;
        this.displaySize = null;
        this.detectInterval = null;

        this.startVideo = this.startVideo.bind(this);
        this.detectFace = this.detectFace.bind(this);
    }

    startVideo() {
        navigator.getUserMedia(
            {
                video: {}
            },
            stream => (this.videoFeed.srcObject = stream),
            err => console.log(err)
        );
    }

    async detectFace() {
        const detection = await FaceAPI.detectSingleFace(this.videoFeed, new FaceAPI.TinyFaceDetectorOptions()).withFaceLandmarks();
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);

        if(detection) {
            const scaledDetection = FaceAPI.resizeResults(detection, this.displaySize);
            
            if(scaledDetection) {
                const bottomRight = {
                    x: scaledDetection.detection.box.bottomLeft.x,
                    y: scaledDetection.detection.box.bottomLeft.y
                };
                const date = `${new Date().toLocaleDateString()}`;
                const time = `${new Date().toLocaleTimeString()}`;
                let texts = [
                    `Tanggal: ${date}`,
                    `Waktu: ${time}`
                ];
    
                FaceAPI.draw.drawDetections(this.canvas, scaledDetection);
                FaceAPI.draw.drawFaceLandmarks(this.canvas, scaledDetection);
    
                new FaceAPI.draw.DrawTextField(
                    texts,
                    bottomRight
                ).draw(this.canvas);
            }
        }
    }

    componentDidMount() {
        this.videoFeed = document.querySelector(`#${style.source_video}`);
        Promise.all([
            FaceAPI.nets.tinyFaceDetector.loadFromUri('/models'),
            FaceAPI.nets.faceLandmark68Net.loadFromUri('/models'),
            FaceAPI.nets.faceRecognitionNet.loadFromUri('/models'),
        ]).then(this.startVideo());

        this.videoFeed.addEventListener("playing", () => {
            let videoWrapper = document.querySelector(`.${style.video_wrapper}`);
            this.canvas = FaceAPI.createCanvasFromMedia(this.videoFeed);
            videoWrapper.append(this.canvas);

            this.displaySize = {
                width: this.videoFeed.getBoundingClientRect().width,
                height: this.videoFeed.getBoundingClientRect().height
            };
            FaceAPI.matchDimensions(this.canvas, this.displaySize);

            this.detectInterval = setInterval(this.detectFace, 100);
        });
    }

    render() {
        return (
            <div className={style.container}>
                <div className={style.video_wrapper}>
                    <video id={style.source_video} autoPlay muted></video>
                </div>
            </div>
        );
    }
}

export default Welcome;