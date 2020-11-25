import React, { Component } from "react";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import history from "../../history";
import * as Config from "../../config";
class NewAssignment extends Component {
  state = {
    Id:0,
    Sessions:[],
    Teachers:[],
    SessionId:0,
    TeacherId:0,
    Classrooms:[],
    ClassroomId:0,
    Loading:false,
    Status:true,
};
onSubmitHandler = async event => {
  event.preventDefault();
  this.setState({ Loading: true });
  let obj = {
    Id: parseInt(this.state.Id),
    SessionId: parseInt(this.state.SessionId),
    TeacherId: parseInt(this.state.TeacherId),
    ClassroomId: parseInt(this.state.ClassroomId),
    Status:this.state.Status,
  };

  await axios
    .post(Config.ApiUrl + "api/assignment/add", obj)
    .then(response => {
      alertify.success(response.data, 4);
    })
    .catch(error => {
      alertify.error(error.response.data, 4);
    });
  this.setState({ Loading: false });
  history.push("/AssignmentSearch");
};
onChangeHandler = (event) => {
  let name = event.target.name;
  let value = event.target.value;
  this.setState({ [name]: value });
}; 
  async componentDidMount() {
    if (this.props.token) {
    await axios
      .get(Config.ApiUrl + "api/session/getactiveforassigment?userid="+parseInt(this.props.user.id))
      .then((c) => {
        this.setState({Sessions:c.data});
      })
      .catch((error) => {
        console.log(error.response);
      });
      for (let index = 0; index < this.state.Sessions.length; index++) {
        if(this.state.Sessions[index].isEnable===true)
        {
          this.setState({ SessionId: this.state.Sessions[index].id });
          break;
        }
      }
      await axios
      .get(Config.ApiUrl + "api/users/getactiveteacherlist")
      .then((t) => {
        this.setState({Teachers:t.data});
      })
      .catch((error) => {
        console.log(error.response);
      });
      this.setState({ TeacherId: this.state.Teachers[0].id });
      await axios
      .get(Config.ApiUrl + "api/classroom/getactivelistforuserid?userid="+
      this.props.user.id
      )
      .then((t) => {
        this.setState({Classrooms:t.data});
        
      })
      .catch((error) => {
        console.log(error.response);
      });
      this.setState({ ClassroomId: this.state.Classrooms[0].id });
      if (history.location.state) {
        await axios
        .get(
          Config.ApiUrl + "api/assignment/getbyid?assigmentid=" +
            history.location.state.id
        )
        .then((r) => {
          this.setState({ SessionId: r.data.sessionId });
          this.setState({TeacherId:r.data.teacherId});
          this.setState({ClassroomId:r.data.classroomId});
          this.setState({Id:r.data.id});
        })
        .catch((error) => {
          console.log(error.response);
        });
        var tempsessions=this.state.Sessions;
        for (let index = 0; index < tempsessions.length; index++) {
          if(parseInt(tempsessions[index].id)===parseInt(this.state.SessionId))
          {
            tempsessions[index].isEnable=true;
            this.setState({ Sessions: tempsessions });
            break;
          }
        }
 

      }
    }
  }
  render() {
    return (
      <div>
        <h1>New Assignment</h1>
        <form onSubmit={this.onSubmitHandler}>
          <div className="row">
           <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="SessionId">Course:</label>
              <div className="form-select">
              <select
              className="form-control"
                type="select"
                name="SessionId"
                value={this.state.SessionId}
                id="SessionId"
                onChange={this.onChangeHandler}
                required
              >
                {this.state.Sessions.map(session => session.isEnable===true?(
                  <option key={session.id} value={session.id}>
                    {session.courseName}-{session.startDate}-{session.endDate}
                  </option>
                ):null)}
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
                value={this.state.TeacherId}
                id="TeacherId"
                onChange={this.onChangeHandler}
              >
                {this.state.Teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName}-{teacher.lastName}
                  </option>
                ))}
              </select>
              </div>
         </div>
         <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="ClassroomId">Classroom:</label>
              <div className="form-select">
              <select
              className="form-control"
                type="select"
                name="ClassroomId"
                value={this.state.ClassroomId}
                id="ClassroomId"
                onChange={this.onChangeHandler}
              >
                {this.state.Classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.branchName}-{classroom.className}
                  </option>
                ))}
              </select>
              </div>
         </div>
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
export default connect(mapStateToProps)(NewAssignment);
