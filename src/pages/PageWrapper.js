import { Component } from 'react';
import BaseContext from '../BaseContext';

import AuthHandler from '../assets/components/AuthHandler/AuthHandler';

import WelcomePage from './Welcome/Welcome';
import ScanPage from './Scan/Scan';
import LoginPage from './Guru/Login/Login';

import LayoutGuru from './Guru/LayoutGuru';
import DashboardPage from './Guru/Dashboard/Dashboard';
import SiswaPage from './Guru/Siswa/Siswa';
import PertemuanPage from './Guru/Pertemuan/Pertemuan';

import NotFoundPage from './Error/NotFound';

import Loading from '../assets/components/Loading/Loading';

class PageWrapper extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('PW CDM');
    }
    
    loadPage(pageName) {
        switch(pageName) {
            case 'welcome':
                return <WelcomePage {...this.props}/>;

            case 'scan':
                return <ScanPage {...this.props}/>;
            
            case 'guru/login':
                return <LoginPage {...this.props}/>;

            case 'guru':
                return <LayoutGuru><DashboardPage {...this.props} /></LayoutGuru>;

            case 'guru/siswa':
                return <LayoutGuru><SiswaPage {...this.props} /></LayoutGuru>;

            case 'guru/pertemuan':
                return <LayoutGuru><PertemuanPage {...this.props} /></LayoutGuru>;
            
            default:
                return <NotFoundPage />;
        }
    }

    render() {
        return (
            <AuthHandler auth={this.props.auth}>
                { 
                    this.loadPage(this.props.pageName)
                }
            </AuthHandler>
        );
    }
}

export default PageWrapper;