import { Component } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';

class PertemuanDetail extends Component {

    constructor(props) {
        super(props);
        this.pertemuanId = this.props.match.params.id;
        this.state = {
            pertemuan: null
        };

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

        axios.get('/pertemuan/' + this.pertemuanId, config)
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
        return (
            <div></div>
        );
    }
}

export default PertemuanDetail;