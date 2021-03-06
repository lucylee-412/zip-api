import React from 'react';
import './index.css'

// Zip code validation check
function isZipCode(zip) {
    return /^\d{5}(-\d{4})?$/.test(zip);
}
// https://stackoverflow.com/a/6786040
function insertCommas(num) {
    let str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            zipcode: "",
            cities: [],
            City: "No results",
            State: "",
            errorMessage: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ zipcode: event.target.value });
    }

    handleSubmit(event) {
        if (this.state.zipcode === "") {
            alert('Please enter a zip code');
        }

        else if (!isZipCode(this.state.zipcode)) {
            alert(this.state.zipcode + ' is not a zip code');
        }

        event.preventDefault();

        fetch(`https://ctp-zip-api.herokuapp.com/zip/${(this.state.zipcode)}`)
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    // Retrieve HTTP Error (404)
                    const error = response.statusText;
                    return Promise.reject(error);
                }

                return data;
            })
            .then((data) => {
                this.setState({
                    cities: data,
                    City: data[0].City,
                    State: data[0].State,
                    Lat: data[0].Lat,
                    Long: data[0].Long,
                    EstimatedPopulation: data[0].EstimatedPopulation,
                    TotalWages: data[0].TotalWages,
                    errorMessage: ""
                })
            })
            .catch(error => {
                this.setState({
                    zipcode: "",
                    cities: [],
                    City: "No results",
                    State: "",
                    errorMessage: "No results"});
            });
    }

    render() {
        const {cities} = this.state;

        return (
            <div className='App'>
                <div className='input-base'>
                    <h1>Zip Code Search</h1>
                    <div id='search-field'>
                        <form onSubmit={this.handleSubmit}>
                            <label id="zipcode" name="zipcode">
                                Zip Code:
                                <input
                                    type="text"
                                    value={this.state.zipcode}
                                    placeholder="ex. 11206"
                                    onChange={this.handleChange}
                                />
                            </label>
                            <span></span>
                            <button type="submit" value="Submit">Submit</button>
                        </form>
                    </div>
                </div>
                <div>{this.state.errorMessage}</div>
                {cities.map((city) => (
                    <div className='container' key={city.LocationText}>
                        <div className='container-top'>{city.City}, {city.State}</div>
                        <ul>
                            <li className='label'>State: {city.State}</li>
                            <li className='label'>Location: {city.Lat}, {city.Long}</li>
                            <li className='label'>Population: {insertCommas(city.EstimatedPopulation)}</li>
                            <li className='label'>Total Wages: {insertCommas(city.TotalWages)}</li>
                        </ul>
                    </div>
                ))}

            </div>

        );
    }
}

export { App };
