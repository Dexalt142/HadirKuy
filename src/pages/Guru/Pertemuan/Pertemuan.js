import { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import BaseContext from '../../../BaseContext';
import axios from 'axios';

import layoutStyle from '../LayoutGuru.module.scss';
import style from './Pertemuan.module.scss';

class Pertemuan extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            pertemuan: []
        }

        this.fetchPertemuan = this.fetchPertemuan.bind(this);
    }

    fetchPertemuan() {
        let localToken = localStorage.getItem('token');
        let config = {
            headers:
            {
                Authorization: `Bearer ${localToken}`
            }
        }

        axios.get('/pertemuan', config)
        .then(res => {
            let pertemuan = res.data.data;
            this.setState({pertemuan: pertemuan});
        })
        .catch(err => {
        });
    }

    componentDidMount() {
        this.fetchPertemuan();
    }

    render() {
        let content = '';

        if(this.state.pertemuan.length > 0) {
            content = this.state.pertemuan.map(pertemuan => {
                let formatDate = new Date(`${pertemuan.tanggal} ${pertemuan.waktu}`);
                let tanggal = `${formatDate.getDate()}/${formatDate.getMonth()}/${formatDate.getFullYear()}`;
                
                return (
                    <div className="col-md-3 mb-4" key={pertemuan.id}>
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                { pertemuan.nama }
                            </div>
                            <div className="card-body">
                                <div className="text-center">
                                    <h4>{ tanggal }</h4>
                                </div>
                                <Link className="btn btn-primary w-100">Detail</Link>
                            </div>
                        </div>
                    </div>
                );
            });
        } else {
            let numOfCard = [1, 2, 3, 4];
            content = numOfCard.map(() => {
                return <div className="col-md-3 mb-4">
                    <div className={'card ' + style.pertemuanSkeleton}>
                        <div className={'card-header py-3 ' + style.skeletonLoader}></div>
                        <div className="card-body">
                            <div className={'d-block py-2 w-50 mx-auto ' + style.skeletonLoader}></div>
                            <div className={'d-block py-3 mt-3 ' + style.skeletonLoader}></div>
                        </div>
                    </div>
                </div>;
            });
        }

        return (
            <div className="container-fluid">
                <div className={layoutStyle.contentTitle}>
                    Daftar Pertemuan
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

export default Pertemuan;