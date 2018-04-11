import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <UploadForm />
      </div>
    );
  }
}


const inputParsers = {
    date(input) {
        const [month, day, year] = input.split('/');
        return `${year}-${month}-${day}`;
    },
    uppercase(input) {
        return input.toUpperCase();
    },
    number(input) {
        return parseFloat(input);
    },
};

class UploadForm extends React.Component {
    constructor() {
        super();
        this.state = {
            contentType: '',
            imageUrl: '',
            fileExtension: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);

    }

    static handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        for (let name of data.keys()) {
            const input = form.elements[name];
            const parserName = input.dataset.parse;

            if (parserName) {
                const parser = inputParsers[parserName];
                const parsedValue = parser(data.get(name));
                data.set(name, parsedValue);
            }
        }

        fetch('https://kir131kf29.execute-api.us-east-2.amazonaws.com/prod/upload-image', {
            method: 'POST',
            body: data,
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    data-parse="uppercase"
                    required
                />

                <input
                    name="title"
                    type="text"
                    placeholder="Title"
                    required
                />

                <button>Upload image!</button>
            </form>
        );
    }
}

export default App;
