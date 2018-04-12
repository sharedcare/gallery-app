import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ImageUpload />
      </div>
    );
  }
}


class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            filename: '',
            imageUrl: '',
            contentType: '',
            fileExtension: ''
        };
        this._handleImageChange = this._handleImageChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleSubmit(e) {
        e.preventDefault();

        const endpoint = 'https://aws.sharedcare.io/gallery-api/upload-image';

        const urlData = new URLSearchParams();
        urlData.append('contentType', this.state.contentType);
        urlData.append('fileExtension', this.state.fileExtension);
        const requestUrl = endpoint + '?' + urlData;
        const file = this.state.file;
        let filename = this.state.filename;

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
            /*
            self.setState({
                filename: resJson.params.params.key
            });
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
            formData.append('file', file);

            filename = resJson.params.params.key;
            return fetch(resJson.params.endpoint_url, {
                method: 'POST',
                body: formData
            });
        }).then( function(response) {
            console.log(response);
            alert('https://gallery-image.s3.amazonaws.com/' + filename);
        });

    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onload = () => {
            this.setState({
                file: file,
                filename: file.name,
                imageUrl: '',
                contentType: file.type,
                fileExtension: file.name.split('.').pop()
            });
            console.log(this.state);
        };

        reader.readAsDataURL(file)
    }


    render() {
        let {imageUrl} = this.state;
        let $imagePreview = null;
        if (imageUrl) {
            $imagePreview = (<img src={imageUrl} />);
        }

        return (
            <div>
                <form onSubmit={this._handleSubmit} encType="multipart/form-data" >
                    <input type="file" accept='image/*' onChange={this._handleImageChange} />
                    <button type="submit" onClick={this._handleSubmit}>Upload Image</button>
                </form>
                {$imagePreview}
            </div>
        )
    }

}

export default App;
