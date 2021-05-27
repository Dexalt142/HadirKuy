import { Component } from 'react';
import BaseContext from '../../../BaseContext';
import axios from 'axios';

import layoutStyle from '../LayoutGuru.module.scss';

import StatsCard from '../../../assets/components/StatsCard/StatsCard';

class Dashboard extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.fetchInterval = null;
        this.state = {
            stats: null
        };

        this.fetchStats = this.fetchStats.bind(this);
    }

    fetchStats() {
        let localToken = localStorage.getItem('token');
        let config = {
            headers:
            {
                Authorization: `Bearer ${localToken}`
            }
        }

        axios.get('/statistic', config)
        .then(res => {
            let stats = res.data.data;
            this.setState({stats: stats});

            if(!this.fetchInterval) {
                this.fetchInterval = setInterval(this.fetchStats, 2000);
            }
        })
        .catch(err => {
            if(err.response) {
                if(err.response.status === 401) {
                    this.context.revokeAuth();
                }
            }
        });
    }
    
    componentDidMount() {
        this.fetchStats();
    }

    componentWillUnmount() {
        if(this.fetchInterval) {
            clearInterval(this.fetchInterval);
            this.fetchInterval = null;
        }
    }
    
    render() {
        let content = '';
        if(this.state.stats) {
            content = (
                <div className="row">
                    <div className="col-md-3 mb-4">
                        <StatsCard title='Jumlah Siswa' value={this.state.stats.siswa}/>
                    </div>

                    <div className="col-md-3 mb-4">
                        <StatsCard title='Jumlah Pertemuan' value={this.state.stats.pertemuan}/>
                    </div>

                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="table-responsive">
                                <table className="table table-hover table-striped mb-0">
                                    <thead>
                                        <tr>
                                            <th>Nama Siswa</th>
                                            <th>Nama Pertemuan</th>
                                            <th>Waktu</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            (this.state.stats.presensi.length < 1 ) ?
                                            <tr>
                                                <td colSpan='4'>
                                                    <h5 className="text-center">Tidak ada presensi terbaru.</h5>
                                                </td>
                                            </tr>
                                            :
                                            this.state.stats.presensi.map((presensi, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            { presensi.nama_siswa }
                                                        </td>
                                                        <td>
                                                            { presensi.nama_pertemuan }
                                                        </td>
                                                        <td>
                                                            { presensi.waktu }
                                                        </td>
                                                        <td>
                                                            <div className={'badge ' + (presensi.status === 'Tepat Waktu' ? 'badge-success' : 'badge-danger')}>{ presensi.status }</div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="container-fluid">
                <div className={layoutStyle.contentTitle}>
                    Dashboard
                </div>
                { content }
            </div>
        )
    }

}

export default Dashboard;