import React, { Component } from "react";
import axios from "axios";
import history from "../../history";
import { connect } from "react-redux";
import alertify from "alertifyjs";
import { Button } from "reactstrap";
import * as Config from "../../config";
class AddTeacher extends Component {
  state = {
    Id: 0,
    TeacherImage: "",
    Ssn: "",
    LastName: "",
    FirstName: "",
    Email: "",
    PasswordHash: "",
    PasswordSalt: "",
    Phone1: "",
    Phone2: "",
    Status: true,
    CountryId: "",
    Address: "",
    BirthDay:"",
    Gender:"",
    RoleId:"",
    InstitutionId:"",
   
    Loading: false,

  };
  async componentDidMount() {
    await axios
      .get(
        Config.ApiUrl + "api/users/getbyuserid?id=" +
          parseInt(history.location.state.id)
      )
      .then((c) => {
        this.setState({ TeacherImage: c.data.imageName });
        this.setState({ Ssn: c.data.ssnPassport });
        this.setState({ LastName: c.data.lastName });
        this.setState({ FirstName: c.data.firstName });
        this.setState({ Email: c.data.email });
        this.setState({ Id: c.data.id });
        this.setState({ PasswordHash: c.data.passwordHash });
        this.setState({ PasswordSalt: c.data.passwordSalt });
        this.setState({ Status: c.data.status });
        this.setState({ Phone1: c.data.phone1 });
        this.setState({ Phone2: c.data.phone2 });
        this.setState({ CountryId: c.data.countryId });
        this.setState({ Address: c.data.address });
        this.setState({BirthDay:c.data.birthDay});
        this.setState({Gender:c.data.gender});
        this.setState({RoleId:c.data.roleId});
        this.setState({InstitutionId:c.data.institutionId});
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  onSubmitHandler = async (event) => {
    event.preventDefault();
    this.setState({ Loading: true });
    let obj = {
      Id: parseInt(this.state.Id),
      SSNPassport: this.state.Ssn,
      FirstName: this.state.FirstName,
      LastName: this.state.LastName,
      Email: this.state.Email,
      ImageName: this.state.TeacherImage,
      PasswordHash: this.state.PasswordHash,
      PasswordSalt: this.state.PasswordSalt,
      Status: this.state.Status,
      Phone1: this.state.Phone1,
      Phone2: this.state.Phone2,
      CountryId: this.state.CountryId,
      Address: this.state.Address,
      BirthDay:this.state.BirthDay,
      Gender:this.state.Gender,
      RoleId:this.state.RoleId,
      InstitutionId:this.state.InstitutionId,
    };
    console.log(obj);
    await axios
      .post(Config.ApiUrl + "api/users/update", obj)
      .then((response) => {
        alertify.success(response.data, 4);
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
    history.push("/TeacherSearch");
  };
  render() {
    return (
      <div>
        <h1 className="content-title"> Update Teacher</h1>
        <div className="row">
          <div className="col-12 col-sm-3 col-lg-3">
            <img className="teacher-img" src={this.state.TeacherImage} alt="" />
          </div>
          <div className="col-12 col-sm-9 col-lg-9">
            <form onSubmit={this.onSubmitHandler}>
              <div className="row">
                <div className="form-group col-12 col-sm-4 col-lg-4">
                  <label htmlFor="Ssn">SSN/Passport</label>
                  <input
                    className="form-control"
                    type="text"
                    name="Ssn"
                    id="Ssn"
                    value={this.state.Ssn}
                    onChange={this.onChangeHandler}
                  />
                </div>
                <div className="form-group col-12 col-sm-4 col-lg-4">
                  <label htmlFor="LastName">Last Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="LastName"
                    id="LastName"
                    value={this.state.LastName}
                    onChange={this.onChangeHandler}
                  />
                </div>
                <div className="form-group col-12 col-sm-4 col-lg-4">
                  <label htmlFor="FirstName">First Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="FirstName"
                    id="FirstName"
                    value={this.state.FirstName}
                    onChange={this.onChangeHandler}
                  />
                </div>
                <div className="form-group col-12 col-sm-4 col-lg-4">
                  <label htmlFor="Email">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    name="Email"
                    id="Email"
                    value={this.state.Email}
                    onChange={this.onChangeHandler}
                    required
                  />
                </div>
                <div className="form-group col-12 col-sm-4 col-lg-4">
                  <label htmlFor="Phone1">Phone1</label>
                  <input
                    className="form-control"
                    type="text"
                    name="Phone1"
                    id="Phone1"
                    value={this.state.Phone1}
                    onChange={this.onChangeHandler}
                  />
                </div>
                <div className="form-group col-12 col-sm-4 col-lg-4">
                  <label htmlFor="Phone1">Phone2</label>
                  <input
                    className="form-control"
                    type="text"
                    name="Phone2"
                    id="Phone2"
                    value={this.state.Phone2}
                    onChange={this.onChangeHandler}
                  />
                </div>
                <div className="form-group col-12 col-sm-4 col-lg-4">
                  <label htmlFor="Address">Address:</label>
                  <textarea
                    className="form-control"
                    name="Address"
                    id="Address"
                    onChange={this.onChangeHandler}
                  />
                </div>
                <Button
                  type="submit"
                  color="success"
                  disabled={this.state.Loading}
                >
                  {this.state.Loading && (
                    <i className="ri-loader-4-line ri-spin"></i>
                  )}
                  {!this.state.Loading && <span>Update</span>}
                  {this.state.Loading && <span> Wait ...</span>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(AddTeacher);
