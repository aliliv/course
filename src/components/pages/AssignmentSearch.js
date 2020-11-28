import React, { Component } from "react";
import Table from "../Table";
import { Button } from "reactstrap";
import axios from "axios";
import * as Config from "../../config";
import { connect } from "react-redux";
class AssignmentSearch extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  state = {
    url: Config.ApiUrl + "api/assignment/getsearch",
    searchObj: {SessionId:0,TeacherId:0,ClassroomId:0},
    editurl: "/NewAssignment",
    status: true,
    Loading: false,
    Sessions: [],
    Teachers: [],
    Classrooms: [],

  };
  async componentDidMount() {
    await axios
      .get(Config.ApiUrl + "api/session/getactive")
      .then((c) => {
        this.setState({ Sessions: c.data });
      })
      .catch((error) => {
        console.log(error.response);
      });

    await axios
      .get(Config.ApiUrl + "api/users/getactiveteacherlist")
      .then((t) => {
        this.setState({ Teachers: t.data });
      })
      .catch((error) => {
        console.log(error.response);
      });

    await axios
      .get(Config.ApiUrl + "api/classroom/getactivelist")
      .then((t) => {
        this.setState({ Classrooms: t.data });
      })
      .catch((error) => {
        console.log(error.response);
      });
    
   // var obj= {SessionId:this.state.Sessions[0].id,TeacherId:this.state.Teachers[0].id,ClassroomId:this.state.Classrooms[0].id};
   // this.setState({searchObj:obj});

  }
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
  onCourseChangeHandler = (event) => {
    let value =parseInt(event.target.value);
    let obj = {SessionId:value,TeacherId:this.state.searchObj.TeacherId,ClassroomId:this.state.searchObj.ClassroomId};
    this.setState({ searchObj: obj });
  };
  onClassroomChangeHandler = (event) => {
    let value =parseInt(event.target.value);
    let obj = {SessionId:this.state.searchObj.SessionId,TeacherId:this.state.searchObj.TeacherId,ClassroomId:value};
    this.setState({ searchObj: obj });
  };
  onTeacherChangeHandler = (event) => {
    let value =parseInt(event.target.value);
    let obj = {SessionId:this.state.searchObj.SessionId,TeacherId:value,ClassroomId:this.state.searchObj.ClassroomId};
    this.setState({ searchObj: obj });
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
        <h1 className="content-title">AssignmentSearch Search</h1>
        <form onSubmit={this.onSubmitHandler}>
          <div className="row align-items-end">
        <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="SessionId">Course:</label>
              <div className="form-select">
              <select
              className="form-control"
                type="select"
                name="SessionId"
                value={this.state.searchObj.SessionId}
                id="SessionId"
                onChange={this.onCourseChangeHandler}
              >
                <option value="0">All</option>
                {this.state.Sessions.map(session => (
                  <option key={session.id} value={session.id}>
                    {session.courseName}-{session.startDate}-{session.endDate}
                  </option>
                ))}
              </select>
              </div>
         </div>
         <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="TeacherId">Teacher:</label>
              <div className="form-select">
              <select
              className="form-control"
                type="select"
                name="TeacherId"
                value={this.state.searchObj.TeacherId}
                id="TeacherId"
                onChange={this.onTeacherChangeHandler}
              >
                 <option value="0">All</option>
                {this.state.Teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName}-{teacher.lastName}
                  </option>
                ))}
              </select>
              </div>
         </div>
         <div className="form-group col-12 col-sm-6 col-lg-2">
              <label htmlFor="ClassroomId">Classroom:</label>
              <div className="form-select">
              <select
              className="form-control"
                type="select"
                name="ClassroomId"
                value={this.state.searchObj.ClassroomId}
                id="ClassroomId"
                onChange={this.onClassroomChangeHandler}
              >
                 <option value="0">All</option>
                {this.state.Classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.branchName}-{classroom.className}
                  </option>
                ))}
              </select>
              </div>
         </div>
         
            <div className="form-group col-12 col-sm-6 col-lg-2">
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

            <div className="form-group col-12 col-sm-6 col-lg-2">
              <Button
                type="submit"
                color="primary"
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
export default connect(mapStateToProps)(AssignmentSearch);

