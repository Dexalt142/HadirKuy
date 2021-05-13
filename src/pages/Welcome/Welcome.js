import { Component } from 'react';
import * as FaceAPI from 'face-api.js/';
import style from './Welcome.module.scss';

import DetectFace from './fragments/DetectFace';

class Welcome extends Component {

    constructor(props) {
        super(props);
        this.videoFeed = null;
        this.canvas = null;
        this.displaySize = null;
        this.detectInterval = null;
        this.state = {
            faceFound: false
        };

        this.startVideo = this.startVideo.bind(this);
        this.detectFace = this.detectFace.bind(this);
        this.loadDetector = this.loadDetector.bind(this);
        this.rescanButton = this.rescanButton.bind(this);
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
    
                // FaceAPI.draw.drawDetections(this.canvas, scaledDetection);
                // FaceAPI.draw.drawFaceLandmarks(this.canvas, scaledDetection);

                // let boundingBox = new FaceAPI.draw.DrawBox(scaledDetection.detection.box, scaledDetection.detection.box.x, scaledDetection.detection.box.y, scaledDetection.detection.box.width, scaledDetection.detection.box.height);

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
    }

    componentDidMount() {
        this.loadDetector();
    }

    rescanButton() {
        this.setState({
            faceFound: false
        });
        setTimeout(() => {
            this.loadDetector();
        }, 1000);
    }

    render() {
        return (
            <DetectFace/>
        );
    }
}

export default Welcome;