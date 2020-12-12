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
      <div className="table-wrapper">
        <div className="table table-responsive" id="studenttable">
          <div className="ttop">
            <div className="thead">
              <div className="tr">
                <div className="th">SessionName</div>
                <div className="th">StartDate</div>
                <div className="th">EndDate</div>
                <div className="th">TotalLates</div>
                <div className="th">TotalAbsance</div>
                <div className="th">Sum</div>
              </div>
            </div>

            <div className="tbody">
              {this.state.AttendanceViews.map((attendance) => (
                <div
                  key={attendance.sessionId}
                  className={
                    attendance.totalLates / 3 + attendance.totalAbsance >=
                    attendance.probation
                      ? "tr bg-danger"
                      : attendance.totalLates / 3 + attendance.totalAbsance >=
                        attendance.probation - 1
                      ? "tr bg-warning"
                      : "tr"
                  }
                >
                  <div className="td">{attendance.sessionName}</div>
                  <div className="td">{attendance.startDate}</div>
                  <div className="td">{attendance.endDate}</div>
                  <div className="td">{attendance.totalLates}</div>
                  <div className="td">{attendance.totalAbsance}</div>
                  <div className="td">
                    {(
                      attendance.totalLates / 3 +
                      attendance.totalAbsance
                    ).toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(StudentAttendance);
