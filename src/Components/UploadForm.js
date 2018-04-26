import React, { Component } from "react";
import { Modal, Input, Form, Button, Header, Image } from 'semantic-ui-react';
import placeholder from '../square-image.png';
import '../App.css';

const buttonStyle = {
    margin: '50px',
    bottom: '0',
    right: '0',
    position: 'fixed',
    zIndex: '5'
};

const textAreaStyle = {
    marginTop: '20px'
};

const formStyle = {
    margin: 'auto',
    width: '65%'
};

const submitStyle = {
    transition: 'all 0.2s ease-out'
};

/**
 *
 */
class ImageUpload extends Component {

    state = {
        open: false,
        loading: false,
        success: 0
    };

    show = dimmer => () => this.setState({ dimmer, open: true });
    close = () => this.setState({ open: false });

    constructor(props) {
        super(props);
        this.state = {
            file: '',
            filename: '',
            imagePreviewUrl: placeholder,
            imageUrl: '',
            contentType: '',
            fileExtension: '',
            description: ''
        };
        this._handleImageChange = this._handleImageChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

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
    };

    /**
     * Submit handle function
     * Send 2 post requests to lambda and s3
     * @param {event} e
     * @private
     */
    _handleSubmit(e) {
        e.preventDefault();
        this.setState({
            loading: true
        });
        // Endpoint of rest api to get signature
        const endpoint = 'https://aws.sharedcare.io/gallery-api/upload-image';

        this.initializeFacebookLogin();
        if (!this.FB) return;
        let accessToken = this.FB.getAccessToken();
        console.log(accessToken);

        // Construct the url parameters
        const urlData = new URLSearchParams();
        urlData.append('contentType', this.state.contentType);
        urlData.append('fileExtension', this.state.fileExtension);
        urlData.append('accessToken', accessToken);
        const requestUrl = endpoint + '?' + urlData;

        // Make a reference to this
        let self = this;


        // Post request to get signature
        fetch(requestUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).then( function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();

        }).then( function(resJson) {
            console.log(resJson);

            self.setState({
                filename: resJson.params.params.key
            });

            /**
             * Construct form data and add parameters s3 post required
             * @type {FormData}
             */
            const formData = new FormData();
            formData.append('key', resJson.params.params.key);
            formData.append('acl', resJson.params.params.acl);
            formData.append('Policy', resJson.params.params.policy);
            formData.append('Content-Type', resJson.params.params['Content-Type']);
            formData.append('X-Amz-Credential', resJson.params.params['x-amz-credential']);
            formData.append('X-Amz-Signature', resJson.params.params['x-amz-signature']);
            formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
            formData.append('X-Amz-Date', resJson.params.params['x-amz-date']);
            formData.append('x-amz-server-side-encryption', 'AES256');
            formData.append('x-amz-meta-tag', '');
            formData.append('file', self.state.file);

            // s3 post request
            return fetch(resJson.params.endpoint_url, {
                method: 'POST',
                body: formData
            });
        }).then( function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            // Returns image url
            self.setState({
                imageUrl: 'https://gallery-image.s3.amazonaws.com/' + self.state.filename
            });

            const endpoint = 'https://aws.sharedcare.io/gallery-api/image-table';
            const requestUrl = endpoint + '?accessToken=' + accessToken;
            const requestBody = {
                TableName: 'Images',
                Item: {
                    ImageId: self.state.filename,
                    ImageUrl: self.state.imageUrl,
                    Description: self.state.description
                }
            };
            return fetch(requestUrl, {
                method: 'POST',
                body: JSON.stringify(requestBody)
            });
        }).then( function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            self.setState({
                loading: false,
                success: 1
            });
        }).catch( function(err) {
            console.log(err);
            self.setState({
                loading: false,
                success: -1
            });
        });

    }

    /**
     * File selector change handle function
     * @param {event} e
     * @private
     */
    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onload = () => {
            this.setState({
                file: file,
                filename: file.name,
                imagePreviewUrl: reader.result,
                contentType: file.type,
                fileExtension: file.name.split('.').pop()
            });
            console.log(this.state);
        };

        reader.readAsDataURL(file)
    }

    /**
     * Render function returns upload form
     * @return {*}
     */
    render() {
        let {imagePreviewUrl, imageUrl} = this.state;
        let $imagePreview = (<Image src={imagePreviewUrl}
                                    as='a'
                                    size='medium'
                                    href={imageUrl}
                                    target='_blank'
                                    centered
                                    rounded />);

        const { open, dimmer, loading, success } = this.state;

        return (
            <div style={buttonStyle}>
                <Button circular icon='write' color='teal' size='big' onClick={this.show(true)}/>
                <Modal dimmer={dimmer} open={open} onClose={this.close}>
                    <Modal.Header>Select a Photo</Modal.Header>
                    <Modal.Content image>
                        {$imagePreview}
                        <Modal.Description style={formStyle}>
                            <Header>Upload Photo</Header>
                            <Input type="file" accept='image/*' onChange={this._handleImageChange} />
                            <Form style={textAreaStyle}>
                                <Form.TextArea label='Description' placeholder='Describe your picture' onChange={(event, value) => { this.setState({ description: value.value });}}/>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={this.close}>
                            Cancel
                        </Button>
                        <Button style={submitStyle} positive={success===1} negative={success===-1} icon='arrow up' labelPosition='right' content='Upload' type="submit" onClick={this._handleSubmit} loading={loading}/>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }

}

export default ImageUpload;

/*
                <Form onSubmit={this._handleSubmit} encType="multipart/form-data">
                    <Form.Input type="file" accept='image/*' onChange={this._handleImageChange} />
                    <Form.TextArea id='form-textarea-control-opinion' label='Description' placeholder='Describe your picture' />
                    <Form.Button id='form-button-control-public' content='Upload' type="submit" onClick={this._handleSubmit} />
                </Form>
 */