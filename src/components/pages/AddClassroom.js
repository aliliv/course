import React, { Component } from "react";
import { Button } from "reactstrap";
import history from "../../history";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import * as Config from "../../config";
class AddClassroom extends Component {
  state = {
    Id: 0,
    ClassName: "",
    Capacity: "",
    Status: true,
    BranchId: "",
    Loading: false,
    IsAdd: true,
  };
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  onActiveHandler = (event) => {
    switch (event.target.value) {
      case "true":
        this.setState({ Status: true });
        break;

      default:
        this.setState({ Status: false });
        break;
    }
  };
  onSubmitHandler = async (event) => {
    event.preventDefault();
    this.setState({ Loading: true });
    let obj = {
      Id: parseInt(this.state.Id),
      ClassName: this.state.ClassName,
      Capacity: parseInt(this.state.Capacity),
      Status: this.state.Status,
      BranchId: parseInt(this.state.BranchId),
    };

    await axios
      .post(Config.ApiUrl + "api/classroom/add", obj)
      .then((response) => {
        alertify.success(response.data, 4);
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
    history.push("/ClassroomSearch");
  };

  async componentDidMount() {
    if (this.props.token) {
      this.setState({ IsAdd: true });
      this.setState({ BranchId: this.props.user.userBranches[0].id });
      if (history.location.state) {
        this.setState({ IsAdd: false });
        await axios
          .get(
            Config.ApiUrl + "api/classroom/getbyid?classroomid=" +
              history.location.state.id
          )
          .then((r) => {
            this.setState({ ClassName: r.data.className });
            this.setState({ Capacity: r.data.capacity });
            this.setState({ BranchId: r.data.branchId });
            this.setState({ Id: r.data.id });
            this.setState({ Status: r.data.status });
          })
          .catch((error) => {
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
        {this.state.IsAdd && <h1 className="content-title">Add Classroom</h1>}
        {!this.state.IsAdd && (
          <h1 className="content-title"> Classroom Update</h1>
        )}

        <form onSubmit={this.onSubmitHandler}>
          <div className="row">
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="ClassName">ClassName:</label>
              <input
                className="form-control"
                value={this.state.ClassName}
                name="ClassName"
                id="ClassName"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Capacity">Capacity:</label>
              <input
                className="form-control"
                value={this.state.Capacity}
                name="Capacity"
                id="Capacity"
                onChange={this.onChangeHandler}
                required
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
            {this.state.IsAdd && (
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="Branch">Branch:</label>
                <div className="form-select">
                  <select
                    className="form-control"
                    type="select"
                    name="BranchId"
                    id="BranchId"
                    onChange={this.onChangeHandler}
                  >
                    {this.props.user.userBranches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          <Button type="submit" color="success" disabled={this.state.Loading}>
            {this.state.Loading && <i className="fa fa-refresh fa-spin"></i>}
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
export default connect(mapStateToProps)(AddClassroom);
