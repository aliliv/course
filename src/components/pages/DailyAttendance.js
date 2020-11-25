import React, { Component } from "react";
import history from "../../history";
import axios from "axios";
import * as Config from "../../config";
import { connect } from "react-redux";
import * as moment from "moment";
import { Button } from "reactstrap";
import alertify from "alertifyjs";

class DailyAttendance extends Component {
  state = {
    Students: [],
    Dates: [],
    Week: 1,
    Weeks: [],
    DataList: [],
    SessionId: 0,
    Loading: false,
  };
  IsEnabled(studentid, date, lesson) {
    for (let i = 0; i < this.state.DataList.length; i++) {
      if (
        this.state.DataList[i].UserId === parseInt(studentid) &&
        this.state.DataList[i].Date === date &&
        this.state.DataList[i].Lesson === parseInt(lesson) &&
        parseInt(this.state.DataList[i].AttendanceAdminStatusId) !== 0
      ) {
        return false;
      }
    }
    return true;
  }
  IsChecked(studentid, date, lesson, attendancestatusid) {
    for (let i = 0; i < this.state.DataList.length; i++) {
      if (
        this.state.DataList[i].UserId === parseInt(studentid) &&
        this.state.DataList[i].Date === date &&
        this.state.DataList[i].Lesson === parseInt(lesson) &&
        this.state.DataList[i].AttendanceStatusId ===
          parseInt(attendancestatusid)
      ) {
        return true;
      }
    }
    return false;
  }
  async SaveAttendance() {
    this.setState({ Loading: true });
    var obj = {
      SessionId: parseInt(this.state.SessionId),
      Attendances: this.state.DataList,
    };
    await axios
      .post(Config.ApiUrl + "api/dailyattendance/add", obj)
      .then((c) => {
        alertify.success(c.data, 4);
      })
      .catch((error) => {
        console.log(error.response);
      });
    this.setState({ Loading: false });
    history.push("/SessionSearch");
  }
  onChangeHandler = async (event) => {
    let value = parseInt(event.target.value);
    this.setState({ Week: value });
    await this.getView(value);
  };
  async RadioChange(userid, date, lesson, attendancestatusid) {
    var datalist = this.state.DataList;
    for (let i = 0; i < datalist.length; i++) {
      if (
        datalist[i].UserId === parseInt(userid) &&
        datalist[i].Date === date &&
        datalist[i].Lesson === parseInt(lesson)
      ) {
        datalist[i].AttendanceStatusId = parseInt(attendancestatusid);
        this.setState({ DataList: datalist });
        return;
      }
    }
    var obj = {
      UserId: parseInt(userid),
      SessionId: parseInt(this.state.SessionId),
      Lesson: parseInt(lesson),
      Date: date,
      AttendanceStatusId: parseInt(attendancestatusid),
      AttendanceAdminStatusId: 0,
    };
    datalist.push(obj);
    this.setState({ DataList: datalist });
  }
  async getView(week) {
    var dailyAttendanceGetDto = {
      SessionId: parseInt(history.location.state.id),
      Week: week,
    };
    await axios
      .post(
        Config.ApiUrl + "api/dailyattendance/getview",
        dailyAttendanceGetDto
      )
      .then((c) => {
        this.setState({ Students: c.data.users });
        this.setState({ Dates: c.data.dates });
        var WeekList = [];
        for (let index = 1; index <= c.data.totalWeek; index++) {
          WeekList.push(index);
        }
        this.setState({ Weeks: WeekList });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  async componentDidMount() {
    if (this.props.token) {
      if (history.location.state) {
        this.setState({ Loading: true });
        this.setState({ SessionId: parseInt(history.location.state.id) });
        await this.getView(this.state.Week);
        await axios
          .get(
            Config.ApiUrl +
              "api/dailyattendance/getall?sessionid=" +
              parseInt(history.location.state.id)
          )
          .then((r) => {
            var datalist = this.state.DataList;
            for (let i = 0; i < r.data.length; i++) {
              var obj = {
                UserId: parseInt(r.data[i].userId),
                SessionId: parseInt(r.data[i].sessionId),
                Lesson: parseInt(r.data[i].lesson),
                Date: r.data[i].date,
                AttendanceStatusId: parseInt(r.data[i].attendanceStatusId),
                AttendanceAdminStatusId: parseInt(
                  r.data[i].attendanceAdminStatusId
                ),
              };
              datalist.push(obj);
            }
            if (r.data.length > 0) {
              this.setState({ DataList: datalist });
            }
          })
          .catch((error) => {
            console.log(error.response);
          });
        this.setState({ Loading: false });
      }
    }
  }

  render() {
    return (
      <div>
        <h1>Daily Attendance</h1>
        <div className="row">
          <div className="col-12">
            <div className="table-wrapper">
              <div className="table reponsive-table">
                <div className="ttop">
                  <div className="thead">
                    <div className="tr">
                      <div className="td">
                        <div className="tr">
                          <div className="td">
                            Week:
                            <select
                              type="select"
                              name="Week"
                              value={this.state.Week}
                              onChange={this.onChangeHandler}
                            >
                              {this.state.Weeks.map((week) => (
                                <option key={week} value={week}>
                                  {week}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="tr">
                          <div className="td">User</div>
                        </div>
                      </div>
                      {this.state.Dates.map((data) => (
                        <div className="td" key={data.date}>
                          <div className="tr">
                            <div className="td">
                              {moment(data.date).format("MM/DD/YYYY")}
                            </div>
                          </div>
                          {data.status === true ? (
                            <div className="tr">
                              <div className="td attandancetd">
                                <div className="tr">
                                  {" "}
                                  <div className="td">1st Lesson</div>
                                </div>
                                <div className="tr">
                                  <div className="td">P</div>
                                  <div className="td">L</div>
                                  <div className="td">A</div>
                                </div>
                              </div>
                              <div className="td attandancetd">
                                <div className="tr">
                                  {" "}
                                  <div className="td">2nd Lesson</div>
                                </div>
                                <div className="tr">
                                  <div className="td">P</div>
                                  <div className="td">L</div>
                                  <div className="td">A</div>
                                </div>
                              </div>
                              <div className="td attandancetd">
                                <div className="tr">
                                  {" "}
                                  <div className="td">3rd Lesson</div>
                                </div>
                                <div className="tr">
                                  <div className="td">P</div>
                                  <div className="td">L</div>
                                  <div className="td">A</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="tr">Holiday</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tbody">
                    {this.state.Students.map((student) => (
                      <div className="tr" key={student.id}>
                        <div className="td">
                          <img
                            className="profile-img d-none d-xl-inline-block"
                            src={student.imageName}
                            alt=""
                          />
                          {student.firstName} {student.lastName}
                        </div>
                        {this.state.Dates.map((data) => (
                          <div className="td" key={data.date}>
                            {data.status === true ? (
                              <div className="tr">
                                <div className="td attandancetd">
                                  {this.IsEnabled(student.id, data.date, 1) ===
                                  true ? (
                                    <div className="tr">
                                      <div className="td">
                                        <input
                                          type="radio"
                                          id="male"
                                          name={student.id + "1" + data.date}
                                          onChange={() =>
                                            this.RadioChange(
                                              student.id,
                                              data.date,
                                              1,
                                              1
                                            )
                                          }
                                          checked={this.IsChecked(
                                            student.id,
                                            data.date,
                                            1,
                                            1
                                          )}
                                        ></input>
                                      </div>
                                      <div className="td">
                                        <input
                                          type="radio"
                                          id="male"
                                          name={student.id + "1" + data.date}
                                          onChange={() =>
                                            this.RadioChange(
                                              student.id,
                                              data.date,
                                              1,
                                              2
                                            )
                                          }
                                          checked={this.IsChecked(
                                            student.id,
                                            data.date,
                                            1,
                                            2
                                          )}
                                        ></input>
                                      </div>
                                      <div className="td">
                                        <input
                                          type="radio"
                                          id="male"
                                          name={student.id + "1" + data.date}
                                          onChange={() =>
                                            this.RadioChange(
                                              student.id,
                                              data.date,
                                              1,
                                              3
                                            )
                                          }
                                          checked={this.IsChecked(
                                            student.id,
                                            data.date,
                                            1,
                                            3
                                          )}
                                        ></input>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                                <div className="td attandancetd">
                                  {this.IsEnabled(student.id, data.date, 2) ===
                                  true ? (
                                    <div className="tr">
                                      <div className="td">
                                        <input
                                          type="radio"
                                          id="male"
                                          name={student.id + "2" + data.date}
                                          onChange={() =>
                                            this.RadioChange(
                                              student.id,
                                              data.date,
                                              2,
                                              1
                                            )
                                          }
                                          checked={this.IsChecked(
                                            student.id,
                                            data.date,
                                            2,
                                            1
                                          )}
                                        ></input>
                                      </div>
                                      <div className="td">
                                        <input
                                          type="radio"
                                          id="male"
                                          name={student.id + "2" + data.date}
                                          onChange={() =>
                                            this.RadioChange(
                                              student.id,
                                              data.date,
                                              2,
                                              2
                                            )
                                          }
                                          checked={this.IsChecked(
                                            student.id,
                                            data.date,
                                            2,
                                            2
                                          )}
                                        ></input>
                                      </div>
                                      <div className="td">
                                        <input
                                          type="radio"
                                          id="male"
                                          name={student.id + "2" + data.date}
                                          onChange={() =>
                                            this.RadioChange(
                                              student.id,
                                              data.date,
                                              2,
                                              3
                                            )
                                          }
                                          checked={this.IsChecked(
                                            student.id,
                                            data.date,
                                            2,
                                            3
                                          )}
                                        ></input>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                                <div className="td attandancetd">
                                  {this.IsEnabled(student.id, data.date, 3) ===
                                  true ? (
                                    <div className="tr">
                                      <div className="td">
                                        <input
                                          type="radio"
                                          id="male"
                                          name={student.id + "3" + data.date}
                                          onChange={() =>
                                            this.RadioChange(
                                              student.id,
                                              data.date,
                                              3,
                                              1
                                            )
                                          }
                                          checked={this.IsChecked(
                                            student.id,
                                            data.date,
                                            3,
                                            1
                                          )}
                                        ></input>
                                      </div>
                                      <div className="td">
                                        <input
                                          type="radio"
                                          id="male"
                                          name={student.id + "3" + data.date}
                                          onChange={() =>
                                            this.RadioChange(
                                              student.id,
                                              data.date,
                                              3,
                                              2
                                            )
                                          }
                                          checked={this.IsChecked(
                                            student.id,
                                            data.date,
                                            3,
                                            2
                                          )}
                                        ></input>
                                      </div>
                                      <div className="td">
                                        <input
                                          type="radio"
                                          id="male"
                                          name={student.id + "3" + data.date}
                                          onChange={() =>
                                            this.RadioChange(
                                              student.id,
                                              data.date,
                                              3,
                                              3
                                            )
                                          }
                                          checked={this.IsChecked(
                                            student.id,
                                            data.date,
                                            3,
                                            3
                                          )}
                                        ></input>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <Button
            className="mt-4 ml-3"
            color="success"
            disabled={this.state.Loading}
            onClick={() => this.SaveAttendance()}
          >
            {this.state.Loading && <i className="fa fa-refresh fa-spin"></i>}
            {!this.state.Loading && <span> Save Attendance</span>}
            {this.state.Loading && <span> Wait ...</span>}
          </Button>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-6">
              <table>
                <thead>
                  <tr>
                    <th>5-Day AM/AFT Programs:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10 minutes late for the first lesson</td>
                    <td>= 1 Late</td>
                  </tr>
                  <tr>
                    <td>Returning more than 5 min. late from break</td>
                    <td>= 1 Late</td>
                  </tr>
                  <tr>
                    <td>Missing more than 15 min. of any lesson</td>
                    <td>= 1/3 Absence</td>
                  </tr>
                  <tr>
                    <td>3 Lates</td>
                    <td>= 1/3 Absence</td>
                  </tr>
                  <tr>
                    <td>4 Absence</td>
                    <td>= Warning Letter</td>
                  </tr>
                  <tr>
                    <td>5 Absences</td>
                    <td>= Probation</td>
                  </tr>
                </tbody>
              </table>
            </div>
        
            <div className="col-6">
            <table>
                <thead>
                  <tr>
                    <th>5-Day PM Programs:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10 minutes late for the first lesson</td>
                    <td>= 1 Late</td>
                  </tr>
                  <tr>
                    <td>Returning more than 5 min. late from break</td>
                    <td>= 1 Late</td>
                  </tr>
                  <tr>
                    <td>Missing more than 15 min. of any lesson</td>
                    <td>= 1/3 Absence</td>
                  </tr>
                  <tr>
                    <td>3 Lates</td>
                    <td>= 1/3 Absence</td>
                  </tr>
                  <tr>
                    <td>3 Absence</td>
                    <td>= Warning Letter</td>
                  </tr>
                  <tr>
                    <td>4 Absences</td>
                    <td>= Probation</td>
                  </tr>
                </tbody>
              </table>
              
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
export default connect(mapStateToProps)(DailyAttendance);
