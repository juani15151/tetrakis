import React from 'react';

export default class InlineAlert extends React.Component {
    render() {
        if(!this.props.message || !this.props.message.content) {
            return;
        }

        const types = {
            'error': 'alert-danger',
            'warn': 'alert-warning',
            'info': 'alert-info',
        };

        return (
            <div className={'alert ' + (types[this.props.message.type] || "")}>
                {this.props.message.content}
            </div>
        )
    }
}