import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import BaseContext from '../../../BaseContext';
import axios from 'axios';

import layoutStyle from '../LayoutGuru.module.scss';

class Siswa extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="container-fluid">
                <div className={layoutStyle.contentTitle}>
                    Daftar Siswa
                </div>
                <div className="row">

                </div>
            </div>
        )
    }

}

export default Siswa;