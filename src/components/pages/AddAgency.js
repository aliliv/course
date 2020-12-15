import React, { Component } from "react";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import history from "../../history";
import * as Config from "../../config";
class AddAgency extends Component {
  state = {
    Id: 0,
    Countries: [],
    CountryId: "",
    Name: "",
    ContactPerson: "",
    Phone: "",
    Fax: "",
    Email: "",
    Commission: 0,
    Status: true,
    Address: "",
    IsAdd:true,
    Loading:false,
  };
  onChangeHandler = event => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  onActiveHandler = event => {
    switch (event.target.value) {
      case "true":
        this.setState({ Status: true });
        break;

      default:
        this.setState({ Status: false });
        break;
    }
  };
  onSubmitHandler = async event => {
    event.preventDefault();
    this.setState({ Loading: true });
    let obj = {
      Id: parseInt(this.state.Id),
      CountryId: parseInt(this.state.CountryId),
      Name: this.state.Name,
      ContactPerson: this.state.ContactPerson,
      Phone: this.state.Phone,
      Fax: this.state.Fax,
      Email: this.state.Email,
      Commission: parseInt(this.state.Commission),
      Status: this.state.Status,
      Address: this.state.Address
    };

    await axios
      .post(Config.ApiUrl + "api/agency/add", obj)
      .then(response => {
        alertify.success(response.data, 4);
      })
      .catch(error => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
    history.push("/AgencySearch");
  };
  async componentDidMount() {
    if (this.props.token) {
      await axios
        .get(Config.ApiUrl + "api/country/getall")
        .then(c => {
          this.setState({ Countries: c.data });
        })
        .catch(error => {
          console.log(error.response);
        });
      this.setState({ CountryId: this.state.Countries[0].id });
      if (history.location.state) {
        this.setState({ IsAdd: false });
        await axios
          .get(
            Config.ApiUrl + "api/agency/getbyid?agencyid=" +
              history.location.state.id
          )
          .then(r => {
            this.setState({ Id: r.data.id });
            this.setState({ Name: r.data.name });
            this.setState({ ContactPerson: r.data.contactPerson });
            this.setState({ Phone: r.data.phone });
            this.setState({ Fax: r.data.fax });
            this.setState({ Email: r.data.email });
            this.setState({ Commission:parseInt(r.data.commission) });
            this.setState({ Status: r.data.status });
            this.setState({ Address: r.data.address });
          })
          .catch(error => {
            console.log(error.response);
          });
      } else {
      }
    } else {
    }
  }
  render() {
    return (
      <div>
        {this.state.IsAdd && <div className="content-title">Add Agency</div>}
        {!this.state.IsAdd && (
          <div className="content-title">Agency Update</div>
        )}

        <form onSubmit={this.onSubmitHandler}>
          <div className="row">
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Course">Country:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  value={this.state.CountryId}
                  type="select"
                  name="CountryId"
                  id="CountryId"
                  onChange={this.onChangeHandler}
                >
                  {this.state.Countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Name">Name</label>
              <input
                className="form-control"
                type="text"
                name="Name"
                id="Name"
                value={this.state.Name}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="ContactPerson">Contact Person</label>
              <input
                className="form-control"
                type="text"
                name="ContactPerson"
                id="ContactPerson"
                value={this.state.ContactPerson}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Phone">Phone</label>
              <input
                className="form-control"
                type="text"
                name="Phone"
                id="Phone"
                value={this.state.Phone}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Fax">Fax</label>
              <input
                className="form-control"
                type="text"
                name="Fax"
                id="Fax"
                value={this.state.Fax}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Email">Email</label>
              <input
                className="form-control"
                type="text"
                name="Email"
                id="Email"
                value={this.state.Email}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Commission">Commission(%)</label>
              <input
                className="form-control"
                min="0"
                max="100"
                type="number"
                name="Commission"
                id="Commission"
                value={this.state.Commission}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Status">Status:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  name="Status"
                  id="Status"
                  onChange={this.onActiveHandler}
                  value={this.state.Status}
                >
                  <option value={true}> Active </option>
                  <option value={false}> Pasive </option>
                </select>
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Address">Address:</label>
              <textarea
                className="form-control"
                name="Address"
                id="exampleText"
                value={this.state.Address}
                onChange={this.onChangeHandler}
              />
            </div>
          </div>
          <Button type="submit" color="success" disabled={this.state.Loading}>
            {this.state.Loading && <i className="ri-loader-4-line ri-spin"></i>}
            {!this.state.Loading && <span> Add</span>}
            {this.state.Loading && <span> Wait ...</span>}
          </Button>
        </form>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(AddAgency);
