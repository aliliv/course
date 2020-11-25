import React, { Component } from "react";
import axios from "axios";
import * as Config from "../../config";
import { connect } from "react-redux";
class StudentAttendance extends Component {
  state = {
    AttendanceViews: [],
  };
  async componentDidMount() {
    await axios
      .get(
        Config.ApiUrl +
          "api/dailyattendance/studentattendancelist?userid=" +
          parseInt(this.props.userid)
      )
      .then((c) => {
        this.setState({ AttendanceViews: c.data });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <table id="studenttable">
            <thead>
              <tr>
                <th>SessionName</th>
                <th>StartDate</th>
                <th>EndDate</th>
                <th>TotalLates</th>
                <th>TotalAbsance</th>
                <th>Sum</th>
              </tr>
            </thead>
            <tbody>
              {this.state.AttendanceViews.map((attendance) => (
                <tr key={attendance.sessionId} 
                className={(
                    attendance.totalLates / 3 +
                    attendance.totalAbsance
                  )>=attendance.probation?"bg-danger":((
                    attendance.totalLates / 3 +
                    attendance.totalAbsance
                  )>=(attendance.probation-1)?"bg-warning":"")}>
                  <td>{attendance.sessionName}</td>
                  <td>{attendance.startDate}</td>
                  <td>{attendance.endDate}</td>
                  <td>{attendance.totalLates}</td>
                  <td>{attendance.totalAbsance}</td>
                  <td>
                    {(
                      attendance.totalLates / 3 +
                      attendance.totalAbsance
                    ).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(StudentAttendance);
