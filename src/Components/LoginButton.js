import React, {Component} from "react";

/**
 * Facebook login and logout button
 */
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

    /**
     * Checks the login status and callbacks to facebookLoginHandler
     */
    checkLoginStatus = () => {
        this.FB.getLoginStatus(this.facebookLoginHandler);
    };

    /**
     * Handles the facebook login callbacks
     * @param response
     */
    facebookLoginHandler = response => {
        if (response.status === 'connected') {
            this.FB.api('/me', userData => {
                let result = {
                    ...response,
                    user: userData
                };
                this.props.setUser([userData.id, result.authResponse.accessToken]);
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
