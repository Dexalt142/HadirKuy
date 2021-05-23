import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import BaseContext from '../../../BaseContext';
import axios from 'axios';

import layoutStyle from '../LayoutGuru.module.scss';

class Pertemuan extends Component {

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
                    Daftar Pertemuan
                </div>
                <div className="row">

                </div>
            </div>
        )
    }

}

export default Pertemuan;