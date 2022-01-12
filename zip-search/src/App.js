import React from 'react';

function isZipCode(zip) {
    return /^\d{5}(-\d{4})?$/.test(zip);
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            zipcode: "",
            city: [],
            errorMessage: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({zipcode: event.target.value});
    }

    handleSubmit(event) {
        if (!isZipCode(this.state.zipcode)) {
            alert(this.state.zipcode + ' is not a zip code.');
        }

        event.preventDefault();

        fetch(`http://ctp-zip-api.herokuapp.com/zip/${(this.state.zipcode)}`)
            .then(async response => {
                const data = await response.json();

                console.log(data)

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response statusText
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
            })
            .catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    /*
    componentDidMount() {
        console.log(this.state.zipcode);
    }
    */

    render() {
        return (
            <>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Zip Code:
                        <input type="text" value={this.state.zipcode} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </>
        );
    }
}

export { App };