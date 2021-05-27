import { Component } from 'react';
import style from './StatsCard.module.scss';

class StatsCard extends Component {

    render() {
        return (
            <div className={'card ' + style.statsCard}>
                <div className="card-body">
                    <div className={style.statsCardTitle}>
                        { this.props.value }
                    </div>
                    <div className={style.statsCardSubtitle}>
                        { this.props.title }
                    </div>
                </div>
            </div>
        );
    }

}

export default StatsCard;