import React, { Component } from "react";
import { Message, Modal, Input, Form, Button, Header, Image as SemanticImage } from 'semantic-ui-react';
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

const max_width = 600;
const max_height = 600;

/**
 * Resize the image into a reasonable size
 * @param {Image} img
 * @param {string} imgType
 * @return {string}
 */
function resizeMe(img, imgType) {

    let canvas = document.createElement('canvas');

    var width = img.width;
    var height = img.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
        if (width > max_width) {
            //height *= max_width / width;
            height = Math.round(height *= max_width / width);
            width = max_width;
        }
    } else {
        if (height > max_height) {
            //width *= max_height / height;
            width = Math.round(width *= max_height / height);
            height = max_height;
        }
    }

    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL(imgType); // get the data from canvas as 70% JPG (can be also PNG, etc.)

}

/**
 * Converts base64 data to raw binary data
 * @param {data} dataURI
 * @return {Blob}
 */
function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;

}

/**
 * Image upload window
 */
class ImageUpload extends Component {

    state = {
        open: false,
        loading: false,
        success: 0,
        visible: false
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
        if (!this.state.description || this.state.description === '' || this.state.file === '') {
            let errMessage = [];
            if (!this.state.description || this.state.description === '')
                errMessage.push('You must include description for your image.');
            if (this.state.file === '')
                errMessage.push('You must choose a image file to upload.');
            this.setState({
                success: -1,
                visible: true,
                errMsg: errMessage
            });
            return;
        }
        this.setState({
            loading: true
        });
        // Endpoint of rest api to get signature
        const endpoint = 'https://aws.sharedcare.io/gallery-api/upload-image';

        this.initializeFacebookLogin();
        if (!this.FB) return;
        let accessToken = this.FB.getAccessToken();

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
            self.props.onUploadDone()
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
            let image = new Image();
            image.src = reader.result;
            image.onload = () => {
                let resized = resizeMe(image);
                this.setState({
                    file: dataURItoBlob(resized)
                })
            };
            this.setState({
                filename: file.name,
                imagePreviewUrl: reader.result,
                contentType: file.type,
                fileExtension: file.name.split('.').pop()
            });
        };

        reader.readAsDataURL(file)
    }

    _handleDismiss = () => {
        this.setState({ visible: false })
    };

    /**
     * Render function returns upload form
     * @return {*}
     */
    render() {
        let {imagePreviewUrl, imageUrl} = this.state;
        let $imagePreview = (<SemanticImage src={imagePreviewUrl}
                                    as='a'
                                    size='medium'
                                    href={imageUrl}
                                    target='_blank'
                                    centered
                                    rounded />);

        const { open, dimmer, loading, success, visible, errMsg } = this.state;

        return (
            <div style={buttonStyle}>
                <Button className='float-button' circular icon='write' color='teal' size='big' onClick={this.show(true)}/>
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
                            {visible && <Message
                                onDismiss={this._handleDismiss}
                                error
                                header='There was some errors with your submission'
                                list={errMsg}
                            />}
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
