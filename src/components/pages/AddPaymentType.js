import React, { Component } from "react";
import * as Config from "../../config";
import axios from "axios";
import alertify from "alertifyjs";
import history from "../../history";
import { Button } from "reactstrap";
import { connect } from "react-redux";
class AddPaymentType extends Component {
  state = {
    Id: 0,
    Name: "",
    Fee:0,
    Order:0,
    IsAdd: true,
    Loading: false,
    ApplyToAll:false,
    Status:true,
  };
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  boolChange = event => {
    this.setState({ [event.target.name]: !this.state[event.target.name] });
  };
  onSubmitHandler = async event => {
    event.preventDefault();
    this.setState({ Loading: true });
    let obj = {
        Id: parseInt(this.state.Id),
        Name:this.state.Name,
        Fee:parseFloat(this.state.Fee),
        Order:parseInt(this.state.Order),
        ApplyToAll:this.state.ApplyToAll,
        Status:this.state.Status,  
        InstitutionId:parseInt(this.props.user.institutionId),
      };
      await axios
      .post(Config.ApiUrl + "api/paymenttype/add", obj)
      .then((response) => {
        alertify.success(response.data, 4);
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
    history.push("/PaymentTypeSearch");

 }
  async componentDidMount() {
    if (this.props.token) {
      this.setState({ IsAdd: true });
      if (history.location.state) {
        this.setState({ IsAdd: false });
        await axios
        .get(
          Config.ApiUrl + "api/paymenttype/getbyid?id=" +
            history.location.state.id
        )
        .then((r) => {
           this.setState({ Name: r.data.name });
           this.setState({ Fee: r.data.fee });
           this.setState({ ApplyToAll: r.data.applyToAll });
           this.setState({ Id: r.data.id });
           this.setState({Order:r.data.order})
           this.setState({ Status: r.data.status });
        })
        .catch((error) => {
          console.log(error.response);
        });
      }
    }
  }
  render() {
    return (
      <div>
        {this.state.IsAdd && <h1 className="content-title">Add PaymentType</h1>}
        {!this.state.IsAdd && (
          <h1 className="content-title"> PaymentType Update</h1>
        )}
        <form onSubmit={this.onSubmitHandler}>
          <div className="row">
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="ClassName">Name:</label>
              <input
                className="form-control"
                value={this.state.Name}
                name="Name"
                id="Name"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-2">
              <label htmlFor="ClassName">Fee:</label>
              <input
                className="form-control"
                type="number"
                value={this.state.Fee}
                name="Fee"
                id="Fee"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-2">
              <label htmlFor="Order">Order:</label>
              <input
                className="form-control"
                type="number"
                value={this.state.Order}
                name="Order"
                id="Order"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-2 d-flex align-items-center">
              <label className="form-csCheck remember-me">
                <input
                  className="form-check-input form-control validate"
                  name="ApplyToAll"
                  checked={this.state.ApplyToAll}
                  type="checkbox"
                  onChange={this.boolChange}
                />
                <span className="form-csCheck-checkmark"></span>
                ApplyToAll
              </label>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Status">Status:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  name="Status"
                  id="Status"
                  onChange={this.boolChange}
                  value={this.state.Status}
                >
                  <option value={true}> Active </option>
                  <option value={false}> Pasive </option>
                </select>
              </div>
            </div>

          </div>
          <Button type="submit" color="success" disabled={this.state.Loading}>
            {this.state.Loading && <i className="ri-loader-4-line ri-spin"></i>}
            {!this.state.Loading && <span> Save</span>}
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
export default connect(mapStateToProps)(AddPaymentType);
