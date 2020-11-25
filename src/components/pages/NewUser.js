import React, { Component } from "react";
import { Button } from "reactstrap";
import axios from "axios";
import history from "../../history";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import MultiSelect from "@khanacademy/react-multi-select";
import DatePicker from "react-datepicker";
import * as moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import S3FileUpload from "react-s3";
import * as Config from "../../config";
class NewUser extends Component {
  state = {
    Id: 0,
    Countries: [],
    CountryId: "",
    Email: "",
    Imagelocation: "",
    FirstName: "",
    LastName: "",
    Phone1: "",
    Phone2: "",
    File: "",
    Loading: false,
    Branchs: [],
    Roles: [],
    date: new Date(),
    Address: "",
    RoleId: 1,
    selected: [],
    Gender: "0",
    SSNPassport: "",
    IsAdd: true,
  };
  async componentDidMount() {
    if (this.props.token) {
      var BranchList = [];
      for (
        let index = 0;
        index < this.props.user.userBranches.length;
        index++
      ) {
        var obj = {
          label: this.props.user.userBranches[index].name,
          value: this.props.user.userBranches[index].id,
        };
        BranchList.push(obj);
      }
      this.setState({ Branchs: BranchList });
      await axios
        .get(Config.ApiUrl + "api/country/getall")
        .then((c) => {
          this.setState({ Countries: c.data });
        })
        .catch((error) => {
          console.log(error.response);
        });
      this.setState({ CountryId: this.state.Countries[0].id });
      await axios
        .get(
          Config.ApiUrl +
            "api/role/getbyinstitutionId?InstitutionId=" +
            this.props.user.institutionId
        )
        .then((role) => {
          this.setState({ Roles: role.data });
        })
        .catch((error) => {
          console.log(error.response);
        });
      if (history.location.state) {
        this.setState({ IsAdd: false });
        await axios
          .get(
            Config.ApiUrl +
              "api/users/getbyuserid?id=" +
              history.location.state.id
          )
          .then((r) => {
         
            if (!(r.data.birthDay == null))this.setState({ date:new Date(moment(r.data.birthDay).format("YYYY,MM,DD")) });    
            if (!(r.data.id == null)) this.setState({ Id: r.data.id });
            if (!(r.data.email == null)) this.setState({ Email: r.data.email });
            if (!(r.data.ssnPassport == null))
              this.setState({ SSNPassport: r.data.ssnPassport });
            if (!(r.data.firstName == null))
              this.setState({ FirstName: r.data.firstName });
            if (!(r.data.lastName == null))
              this.setState({ LastName: r.data.lastName });
            if (!(r.data.phone1 == null))
              this.setState({ Phone1: r.data.phone1 });
            if (!(r.data.phone2 == null))
              this.setState({ Phone2: r.data.phone2 });
            if (!(r.data.address == null))
              this.setState({ Address: r.data.address });
            this.setState({ Gender: r.data.gender });
          })
          .catch((error) => {
            console.log(error.response);
          });
      }
    } else {
    }
  }
  handleChange = (date) => {
    this.setState({
      date: date,
    });
  };
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  onRoleHandler = (event) => {
    this.setState({ RoleId: event.target.value });
  };
  onGenderHandler = (event) => {
    this.setState({ Gender: event.target.value });
  };
  onSubmitHandler = async (event) => {
    event.preventDefault();
    this.setState({ Loading: true });
    const Branchs = [];
    for (let index = 0; index < this.state.selected.length; index++) {
      const obj = { Id: this.state.selected[index] };
      Branchs.push(obj);
    }

    if (this.state.File !== "") {
      await S3FileUpload.uploadFile(this.state.File, Config.S3UserImageconfig)
        .then((data) => {
          this.setState({ Imagelocation: data.location });
        })
        .catch((err) => console.error(err));
    }
    let obj = {
      Id: this.state.Id,
      Email: this.state.Email,
      FirstName: this.state.FirstName,
      LastName: this.state.LastName,
      Phone1: this.state.Phone1,
      Phone2: this.state.Phone2,
      ImageName: this.state.Imagelocation,
      Branchs: Branchs,
      Address: this.state.Address,
      BirthDay: moment(this.state.date).format("MM.DD.YYYY"),
      CountryId: parseInt(this.state.CountryId),
      RoleId: parseInt(this.state.RoleId),
      InstitutionId: parseInt(this.props.user.institutionId),
      Gender: parseInt(this.state.Gender),
      SSNPassport: this.state.SSNPassport,
    };
    await axios
      .post(Config.ApiUrl + "api/auth/register", obj)
      .then((response) => {
        if(parseInt(this.state.Id)===0)
        {
          alertify.success(response.data.message, 4);
          this.setState({ Id: parseInt(response.data.data.id) });
        }
        else
        alertify.success(response.data, 4);
       
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
    if (this.state.RoleId === "2") {
      history.push({
        pathname: "/AddStudent",
        search: "",
        state: { id: this.state.Id },
      });
    } else history.push("/UserSearch");
  };

  handleFile = (e) => {
    var blob = e.target.files[0].slice(0, e.target.files[0].size);
    var newFile = new File(
      [blob],
      e.target.files[0].name.substring(0, e.target.files[0].name.indexOf(".")) +
        Date.now() +
        ".png",
      { type: "image/png" }
    );
    this.setState({ File: newFile });
  };
  render() {
    return (
      <div>
        <div className="content-title">New User</div>

        <form action="" onSubmit={this.onSubmitHandler}>
          <div className="row">
            {this.state.IsAdd && (
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="exampleEmail">Email</label>
                <input
                  className="form-control"
                  type="email"
                  name="Email"
                  id="exampleEmail"
                  value={this.state.Email}
                  onChange={this.onChangeHandler}
                  required
                />
              </div>
            )}
            {this.state.IsAdd && (
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label>Image:</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={this.handleFile}
                />
              </div>
            )}
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="SSNPassport">SSN/Passport</label>
              <input
                className="form-control"
                name="SSNPassport"
                id="SSNPassport"
                onChange={this.onChangeHandler}
                value={this.state.SSNPassport}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="FirstName">Name</label>
              <input
                className="form-control"
                name="FirstName"
                id="FirstName"
                onChange={this.onChangeHandler}
                value={this.state.FirstName}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="LastName">Last Name</label>
              <input
                className="form-control"
                name="LastName"
                id="LastName"
                onChange={this.onChangeHandler}
                value={this.state.LastName}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Phone1">Phone1:</label>
              <input
                className="form-control"
                name="Phone1"
                id="Phone1"
                onChange={this.onChangeHandler}
                value={this.state.Phone1}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Phone2">Phone2:</label>
              <input
                className="form-control"
                name="Phone2"
                id="Phone2"
                value={this.state.Phone2}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="exampleDate">BrithDay:</label>
              <div className="form-select">
                <DatePicker
                  className="form-control"
                  selected={this.state.date}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            {this.state.IsAdd && (
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="Phone2">Branhs:</label>
                <div className="form-select">
                  <MultiSelect
                    options={this.state.Branchs}
                    selected={this.state.selected}
                    onSelectedChanged={(selected) =>
                      this.setState({ selected })
                    }
                  />
                </div>
              </div>
            )}
            {this.state.IsAdd && (
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="name">Select User</label>
                <div className="form-select">
                  <select
                    name="selectMulti"
                    id="exampleSelectMulti"
                    onChange={this.onRoleHandler}
                    className="form-control"
                  >
                    {this.state.Roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
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
                  {this.state.Countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="name">Gender:</label>
              <div className="form-select">
                <select
                  name="Gender"
                  id="Gender"
                  onChange={this.onGenderHandler}
                  className="form-control"
                  value={this.state.Gender}
                >
                  <option value="0"> Male </option>
                  <option value="1"> Female </option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
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
          <Button
            color="success"
            className="mr-3"
            type="submit"
            disabled={this.state.Loading}
          >
            {this.state.Loading && <i className="fa fa-refresh fa-spin"></i>}
            {!this.state.Loading && (
              <span>{this.state.IsAdd === true ? "Sign Up" : "Update"}</span>
            )}
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
export default connect(mapStateToProps)(NewUser);
