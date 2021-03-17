import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import history from "../../history";
import * as Config from "../../config";
import * as moment from "moment";
class AttendanceSheet extends Component {
  state = {
    Students: [],
    Dates: [],
  };
  async getattendancesheet(sessionid){
    await axios
    .get(
      Config.ApiUrl +
        "api/dailyattendance/getattendancesheet?sessionid=" +
        sessionid,
    )
    .then((r) => {
      this.setState({ Students: r.data.users });
      this.setState({ Dates: r.data.dates });
    })
    .catch((error) => {
      console.log(error.response);
    });
  }
  async componentDidMount() {
    if (this.props.token) {
      if (history.location.state) {
        this.getattendancesheet(history.location.state.id);
      }
      else//teachermainredirect
      {
        this.getattendancesheet(this.props.sessionid);
      }
    }
  }
  render() {
    return (
      <div>
        <h1>Attendance Sheet</h1>
        <div className="row">
          <div className="col-12">
            <table className="attendancesheet">
              <thead>
                <tr>
                  <th></th>
                  {this.state.Dates.map((data) => (
                    <th key={data}>{moment(data).format("MM/DD")}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.state.Students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <img
                        className="profile-img d-none d-xl-inline-block"
                        src={student.imageName}
                        alt=""
                      />
                      {student.firstName} {student.lastName}
                    </td>
                    {this.state.Dates.map((data) => (
                      <td key={data}></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <h6>Please Take Attendance When you Start Class and also After the Break</h6>
          </div>
          <div className="col-12">
            <h6>1 - 30 minutes late = 1 Late; Over 30 minutes late = Half Absence; 3 Lates = Half Absence; 4 Absences = Warning Letter</h6>
          </div>
          <div className="col-12">
            <h6>Morning Class Time: 8:45 AM - 10:30 AM, 11:00 AM - 12:30 PM</h6>
          </div>
          <div className="col-12">
            <h6>Afternoon Class Time: 1:15 PM - 3:00 PM, 3:30 PM - 5:00 PM</h6>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(AttendanceSheet);
