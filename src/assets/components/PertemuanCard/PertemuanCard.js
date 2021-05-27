import { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './PertemuanCard.module.scss';

class PertemuanCard extends Component {

    render() {
        return (
            <div className={'card ' + style.pertemuanCard}>
                <div className="card-header bg-primary text-white d-flex justify-content-between">
                    <div>
                        { this.props.pertemuan.nama}
                    </div>
                    <div>
                        { this.props.pertemuan.kode_pertemuan }
                    </div>
                </div>
                <div className="card-body">
                    <div className="text-center">
                        <h4>{ this.props.pertemuan.date_time }</h4>
                    </div>
                    <Link className="btn btn-primary w-100" to={'/guru/pertemuan/' + this.props.pertemuan.id}>Detail</Link>
                </div>
            </div>
        );
    }

}

export default PertemuanCard;