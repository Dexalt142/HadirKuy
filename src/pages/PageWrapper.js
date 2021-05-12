import { Component } from 'react';
import WelcomePage from './Welcome/Welcome';
import NotFoundPage from './Error/NotFound';

class PageWrapper extends Component {

    componentDidMount() {
    }
    
    loadPage(pageName) {
        switch(pageName) {
            case 'welcome':
                return <WelcomePage/>;
            
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