import React, { Component } from "react";
import axios from "axios";
import AttendanceSheet from "../pages/AttendanceSheet";
import StudentAssessment from "../pages/StudentAssessment";
import DailyAttendance from "../pages/DailyAttendance";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import { Confirm, Modal } from 'semantic-ui-react';
import history from "../../history";
import * as Config from "../../config";
class TeacherMain extends Component {
  state = {
    View: [],
    ModalShow:false,
    ViewId:0,
    ActiveSessionId:0,
  };
  async componentDidMount() {
    await axios
      .get(
        Config.ApiUrl +
          "api/assignment/getteachermain?userid=" +
          this.props.user.id
      )
      .then((r) => {
        this.setState({ View: r.data });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  render() {
    return (
      <div>
       <Modal
          onClose={() => this.setState({ ModalShow: false })}
          open={this.state.ModalShow}
        >
          <Modal.Header>
           {parseInt(this.state.ViewId)===1 && <div>Attendance Sheet</div>}
           {parseInt(this.state.ViewId)===2 && <div>Student Assessment</div>}
           {parseInt(this.state.ViewId)===3 && <div>DailyAttendance</div>}

          </Modal.Header>
          <Modal.Content>
            {parseInt(this.state.ViewId)===1 && <AttendanceSheet sessionid={this.state.ActiveSessionId}/>}
            {parseInt(this.state.ViewId)===2 && <StudentAssessment sessionid={this.state.ActiveSessionId}/>}
            {parseInt(this.state.ViewId)===3 && <DailyAttendance sessionid={this.state.ActiveSessionId}/>}
          </Modal.Content>
          <Modal.Actions>
            <button
              className="btn btn-success"
              onClick={() => this.setState({ ModalShow: false })}
            >
              Exit
            </button>
          </Modal.Actions>
        </Modal>

        <div className="content-title">Teacher Main</div>
        {this.state.View.map((course) => (
          <div className="card" key={course.sessionId}>
            <div className="card-header">
              Course: {course.coursName} Date: ({course.startDate}-
              {course.endDate}) Class: {course.classroomName}
            </div>
            <div className="card-body">
            <div className="row">   
                <div className="col-12">
                <div className="table-wrapper">
                  <div className="table table-responsive">
                    <div className="ttop">
                      <div className="thead">
                        <div className="tr">
                          <div className="th">ATTENDANCE</div>
                          <div className="th">GRADING</div>
                               
                        </div>
                      </div>
                      <div className="tbody">
                         <div className="tr">
                           <div className="td ">
                            <div className="btn btn-link" onClick={() => this.setState({ ModalShow: true,ViewId:1,ActiveSessionId:course.sessionId})} >Attendance Sheet</div>   
                            </div>
                           <div className="td">
                             <div className="btn btn-link" onClick={() => this.setState({ ModalShow: true,ViewId:2,ActiveSessionId:course.sessionId})}>Enter Assessment Grades</div>
                           </div>
                         </div>
                         <div className="tr">
                           <div className="td">
                             <div className="btn btn-link" onClick={() => this.setState({ ModalShow: true,ViewId:3,ActiveSessionId:course.sessionId})} >Enter  Daily Attendance</div>             
                             </div>
                           <div className="td"></div>
                         </div>
             
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(TeacherMain);
