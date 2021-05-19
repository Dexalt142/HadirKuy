import { Component } from 'react';
import WelcomePage from './Welcome/Welcome';
import ScanPage from './Scan/Scan';
import LoginPage from './Login/Login';

import NotFoundPage from './Error/NotFound';

class PageWrapper extends Component {

    componentDidMount() {
    }
    
    loadPage(pageName) {
        switch(pageName) {
            case 'welcome':
                return <WelcomePage/>;

            case 'scan':
                return <ScanPage />;
            
            case 'guru/login':
                return <LoginPage />;
            
            default:
                return <NotFoundPage/>;
        }
    }

    render() {
        return (
            <main>
                { this.loadPage(this.props.pageName) }
            </main>
        );
    }
}

export default PageWrapper;