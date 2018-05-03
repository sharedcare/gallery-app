import React, {Component} from "react";

class FacebookLoginButton extends Component {

    componentDidMount() {
        document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
    }

    componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
    }

    /**
     * Init FB object and check Facebook Login status
     */
    initializeFacebookLogin = () => {
        this.FB = window.FB;
        this.checkLoginStatus();
    };

    checkLoginStatus = () => {
        this.FB.getLoginStatus(this.facebookLoginHandler);
    };

    facebookLoginHandler = response => {
        if (response.status === 'connected') {
            this.FB.api('/me', userData => {
                let result = {
                    ...response,
                    user: userData
                };
                this.props.setUser([userData.id, result.authResponse.accessToken]);
                console.log(result);
            });
        }
    };

    render() {
        return (
            <div className="fb-login-button"
                 data-max-rows="1"
                 data-size="medium"
                 data-button-type="login_with"
                 data-use-continue-as="true"
                 data-auto-logout-link="true">
            </div>
        );
    }
}

export default FacebookLoginButton;
