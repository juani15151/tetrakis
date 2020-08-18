import React from "react";
import './ErrorBoundary.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons'

export default class ErrorBoundary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        }
    }


    render() {
        if(this.state.hasError) {
            return (
                <div className="row justify-content-center error-boundary">
                    <div className="col text-center">
                        <FontAwesomeIcon icon={faBug}/> Something went wrong :(
                    </div>
                </div>
            );
        }

        return this.props.children;
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            hasError: true
        });
    }
}