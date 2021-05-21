import { Component } from 'react';
import BaseContext from '../BaseContext';

import AuthHandler from '../assets/components/AuthHandler/AuthHandler';

import WelcomePage from './Welcome/Welcome';
import ScanPage from './Scan/Scan';
import LoginPage from './Guru/Login/Login';
import DashboardPage from './Guru/Dashboard/Dashboard';

import NotFoundPage from './Error/NotFound';

import Loading from '../assets/components/Loading/Loading';

class PageWrapper extends Component {

    static contextType = BaseContext;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
    
    loadPage(pageName) {
        switch(pageName) {
            case 'welcome':
                return <WelcomePage />;

            case 'scan':
                return <ScanPage />;
            
            case 'guru/login':
                return <LoginPage />;

            case 'guru':
                return <DashboardPage />;
            
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