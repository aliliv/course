import React, { Component } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import Table from "../Table";
import * as Config from "../../config";
class PaymentTypeSearch extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  state = {
    url: Config.ApiUrl + "api/paymenttype/getsearch",
    searchObj: { Name: "" },
    editurl: "/AddPaymentType",
    status: true,
    Loading: false,
  };
  onChangeHandler = (event) => {
    let value = event.target.value;
    let obj = { Name: value };
    this.setState({ searchObj: obj });
  };
  onActiveHandler = (event) => {
    switch (event.target.value) {
      case "true":
        this.setState({ status: true });
        break;

      default:
        this.setState({ status: false });
        break;
    }
  };
  onSubmitHandler = async (event) => {
    event.preventDefault();
    this.setState({ Loading: true });
    this.child.current.componentDidMount();
    this.setState({ Loading: false });
  };
  render() {
    return (
      <div>
        <h1 className="content-title">PaymentType Search</h1>
        <form onSubmit={this.onSubmitHandler}>
          <div className="row align-items-end">
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="ClassName">Name:</label>
              <input
                className="form-control"
                name="Name"
                id="Name"
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
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(PaymentTypeSearch);
