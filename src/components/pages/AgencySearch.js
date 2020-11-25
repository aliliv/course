import React, { Component } from "react";
import Table from "../Table";
import { Button } from "reactstrap";
import axios from "axios";
import * as Config from "../../config";
export default class AgencySearch extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  state = {
    url: Config.ApiUrl + "api/agency/getsearch",
    searchObj: { CountryId: 0, SearchWord: "" },
    editurl: "/AddAgency",
    status: true,
    Loading: false,
    Countries:[]
  };
  onActiveHandler = event => {
    switch (event.target.value) {
      case "true":
        this.setState({ status: true });
        break;

      default:
        this.setState({ status: false });
        break;
    }
  };
  onSubmitHandler = async event => {
    event.preventDefault();
    this.setState({ Loading: true });
    this.child.current.componentDidMount();
    this.setState({ Loading: false });
  };
  async componentDidMount() {
   
      await axios
        .get(Config.ApiUrl + "api/country/getall")
        .then(c => {
          this.setState({ Countries: c.data });
        })
        .catch(error => {
          console.log(error.response);
        });
      this.setState({ CountryId: 0 });
 
  };
  onCountryChangeHandler = event => {
    let value =parseInt(event.target.value);
    let  obj= { CountryId: value, SearchWord: this.state.searchObj.SearchWord };
    this.setState({ searchObj: obj });
  };
  onWordChangeHandler = event => {
    let value =event.target.value;
    let country=parseInt(this.state.searchObj.CountryId);
    let  obj= { CountryId:country, SearchWord: value };
    this.setState({ searchObj: obj });
  };
  render() {
    return (
      <div>
        <h1>Agency Search</h1>
        <form onSubmit={this.onSubmitHandler}>
          <div className="row align-items-end">
          <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="SearchWord">Search Word:</label>
              <input
                className="form-control"
                name="SearchWord"
                id="SearchWord"
                onChange={this.onWordChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Course">Country:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  value={this.state.searchObj.CountryId}
                  type="select"
                  name="CountryId"
                  id="CountryId"
                  onChange={this.onCountryChangeHandler}
                >
                 <option key="0" value={0}>All</option>
                  {this.state.Countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Status">Status:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  name="Status"
                  id="Status"
                  onChange={this.onActiveHandler}
                  value={this.state.status}
                >
                  <option value={true}> Active </option>
                  <option value={false}> Pasive </option>
                </select>
              </div>
            </div>

            <div className="form-group col-12 col-sm-6 col-lg-3">
              <Button
                type="submit"
                color="success"
                disabled={this.state.Loading}
              >
                {this.state.Loading && (
                  <i className="fa fa-refresh fa-spin"></i>
                )}
                {!this.state.Loading && <span> Search</span>}
                {this.state.Loading && <span> Wait ...</span>}
              </Button>
            </div>
          </div>
        </form>
        <Table
          searchobj={this.state}
          userid={this.props.user.id}
          ref={this.child}
        />
      </div>
    );
  }
}
