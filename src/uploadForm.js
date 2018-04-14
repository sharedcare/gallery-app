import React, { Component } from "react";
import './App.css';

/**
 *
 */
class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            filename: '',
            imagePreviewUrl: '',
            imageUrl: '',
            contentType: '',
            fileExtension: ''
        };
        this._handleImageChange = this._handleImageChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    /**
     * Submit handle function
     * Send 2 post requests to lambda and s3
     * @param {event} e
     * @private
     */
    _handleSubmit(e) {
        e.preventDefault();

        // Endpoint of rest api to get signature
        const endpoint = 'https://aws.sharedcare.io/gallery-api/upload-image';

        // Construct the url parameters
        const urlData = new URLSearchParams();
        urlData.append('contentType', this.state.contentType);
        urlData.append('fileExtension', this.state.fileExtension);
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
            alert(self.state.imageUrl);
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
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} />);
        }

        return (
            <div>
                <form onSubmit={this._handleSubmit} encType="multipart/form-data" >
                    <input type="file" accept='image/*' onChange={this._handleImageChange} />
                    <button type="submit" onClick={this._handleSubmit}>Upload Image</button>
                </form>
                {$imagePreview}
            </div>
        );
    }

}

export default ImageUpload;