import { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './Welcome.module.scss';
import BaseContext from '../../BaseContext';
import axios from 'axios';

class Welcome extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
        this.state = {
            kode_pertemuan: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.checkPertemuan = this.checkPertemuan.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    checkPertemuan() {
        if(this.state.kode_pertemuan) {
            axios.get(`pertemuan/${this.state.kode_pertemuan}`)
            .then(res => {
                this.context.setBaseState('pertemuan', res.data.data);
                this.props.history.push('/scan');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="card card-body">
                            <div className="form-group">
                                <label>Kode pertemuan</label>
                                <input className="form-control" type="text" name="kode_pertemuan" value={this.state.kode_pertemuan} onChange={this.handleInputChange}></input>
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary" onClick={this.checkPertemuan}>Buka Presensi</button>
                                <Link className="btn btn-primary" to="/scan">Move to Scan Page</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Welcome;