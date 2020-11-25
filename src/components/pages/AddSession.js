import React, { Component } from "react";
import { Button } from "reactstrap";
import history from "../../history";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import * as moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import * as Config from "../../config";
class AddSession extends Component {
  state = {
    Id: 0,
    Tuition: 0,
    Status: true,
    BranchId: "",
    startdate: new Date(),
    enddate: new Date(),
    Course: "",
    Evaluation: "",
    Courses: [],
    Evaluations: [],
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Loading: false,
    IsAdd: true,
    MondayStartType: 0,
    MondayEndType: 0,
    MondayEndHour: 1,
    MondayEndMinute: 0,
    MondayStartHour: 1,
    MondayStartMinute: 0,
    TuesdayStartType: 0,
    TuesdayEndType: 0,
    TuesdayEndHour: 1,
    TuesdayEndMinute: 0,
    TuesdayStartHour: 1,
    TuesdayStartMinute: 0,
    WednesdayStartType: 0,
    WednesdayEndType: 0,
    WednesdayEndHour: 1,
    WednesdayEndMinute: 0,
    WednesdayStartHour: 1,
    WednesdayStartMinute: 0,
    ThursdayStartType: 0,
    ThursdayEndType: 0,
    ThursdayEndHour: 1,
    ThursdayEndMinute: 0,
    ThursdayStartHour: 1,
    ThursdayStartMinute: 0,
    FridayStartType: 0,
    FridayEndType: 0,
    FridayEndHour: 1,
    FridayEndMinute: 0,
    FridayStartHour: 1,
    FridayStartMinute: 0,
    Probation: 0,
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
  onBranchChangeHandler = async (event) => {
    let value = event.target.value;
    this.setState({ BranchId: value });
    await axios
      .get(
        Config.ApiUrl + "api/course/getbybranchid?branchid=" + parseInt(value)
      )
      .then((c) => {
        this.setState({ Courses: c.data });
        if (c.data.length > 0) {
          this.setState({ Course: c.data[0].id });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  onSubmitHandler = async (event) => {
    event.preventDefault();
    this.setState({ Loading: true });
    let mondayStartTime = 0,
      tuesdayStartTime = 0,
      wednesdayStartTime = 0,
      thursdayStartTime = 0,
      fridayStartTime = 0;
    let mondayEndTime = 0,
      tuesdayEndTime = 0,
      wednesdayEndTime = 0,
      thursdayEndTime = 0,
      fridayEndTime = 0;

    if (this.state.Monday) {
      if (parseInt(this.state.MondayStartType) === 0) {
        if (parseInt(this.state.MondayStartHour) === 12) {
          mondayStartTime = parseInt(this.state.MondayStartMinute) / 100;
        } else {
          mondayStartTime =
            parseInt(this.state.MondayStartHour) +
            parseInt(this.state.MondayStartMinute) / 100;
        }
      } else {
        if (parseInt(this.state.MondayStartHour) === 12) {
          mondayStartTime =
            parseInt(this.state.MondayStartHour) +
            parseInt(this.state.MondayStartMinute) / 100;
        } else {
          mondayStartTime =
            parseInt(this.state.MondayStartHour) +
            12 +
            parseInt(this.state.MondayStartMinute) / 100;
        }
      }

      if (parseInt(this.state.MondayEndType) === 0) {
        if (parseInt(this.state.MondayEndHour) === 12) {
          mondayEndTime = parseInt(this.state.MondayEndMinute) / 100;
        } else {
          mondayEndTime =
            parseInt(this.state.MondayEndHour) +
            parseInt(this.state.MondayEndMinute) / 100;
        }
      } else {
        if (parseInt(this.state.MondayEndHour) === 12) {
          mondayEndTime =
            parseInt(this.state.MondayEndHour) +
            parseInt(this.state.MondayEndMinute) / 100;
        } else {
          mondayEndTime =
            parseInt(this.state.MondayEndHour) +
            12 +
            parseInt(this.state.MondayEndMinute) / 100;
        }
      }
    }

    if (this.state.Tuesday) {
      if (parseInt(this.state.TuesdayStartType) === 0) {
        if (parseInt(this.state.TuesdayStartHour) === 12) {
          tuesdayStartTime = parseInt(this.state.TuesdayStartMinute) / 100;
        } else {
          tuesdayStartTime =
            parseInt(this.state.TuesdayStartHour) +
            parseInt(this.state.TuesdayStartMinute) / 100;
        }
      } else {
        if (parseInt(this.state.TuesdayStartHour) === 12) {
          tuesdayStartTime =
            parseInt(this.state.TuesdayStartHour) +
            parseInt(this.state.TuesdayStartMinute) / 100;
        } else {
          tuesdayStartTime =
            parseInt(this.state.TuesdayStartHour) +
            12 +
            parseInt(this.state.TuesdayStartMinute) / 100;
        }
      }

      if (parseInt(this.state.TuesdayEndType) === 0) {
        if (parseInt(this.state.TuesdayEndHour) === 12) {
          tuesdayEndTime = parseInt(this.state.TuesdayEndMinute) / 100;
        } else {
          tuesdayEndTime =
            parseInt(this.state.TuesdayEndHour) +
            parseInt(this.state.TuesdayEndMinute) / 100;
        }
      } else {
        if (parseInt(this.state.TuesdayEndHour) === 12) {
          tuesdayEndTime =
            parseInt(this.state.TuesdayEndHour) +
            parseInt(this.state.TuesdayEndMinute) / 100;
        } else {
          tuesdayEndTime =
            parseInt(this.state.TuesdayEndHour) +
            12 +
            parseInt(this.state.TuesdayEndMinute) / 100;
        }
      }
    }

    if (this.state.Wednesday) {
      if (parseInt(this.state.WednesdayStartType) === 0) {
        if (parseInt(this.state.WednesdayStartHour) === 12) {
          wednesdayStartTime = parseInt(this.state.WednesdayStartMinute) / 100;
        } else {
          wednesdayStartTime =
            parseInt(this.state.WednesdayStartHour) +
            parseInt(this.state.WednesdayStartMinute) / 100;
        }
      } else {
        if (parseInt(this.state.WednesdayStartHour) === 12) {
          wednesdayStartTime =
            parseInt(this.state.WednesdayStartHour) +
            parseInt(this.state.WednesdayStartMinute) / 100;
        } else {
          wednesdayStartTime =
            parseInt(this.state.WednesdayStartHour) +
            12 +
            parseInt(this.state.WednesdayStartMinute) / 100;
        }
      }

      if (parseInt(this.state.WednesdayEndType) === 0) {
        if (parseInt(this.state.WednesdayEndHour) === 12) {
          wednesdayEndTime = parseInt(this.state.WednesdayEndMinute) / 100;
        } else {
          wednesdayEndTime =
            parseInt(this.state.WednesdayEndHour) +
            parseInt(this.state.WednesdayEndMinute) / 100;
        }
      } else {
        if (parseInt(this.state.WednesdayEndHour) === 12) {
          wednesdayEndTime =
            parseInt(this.state.WednesdayEndHour) +
            parseInt(this.state.WednesdayEndMinute) / 100;
        } else {
          wednesdayEndTime =
            parseInt(this.state.WednesdayEndHour) +
            12 +
            parseInt(this.state.WednesdayEndMinute) / 100;
        }
      }
    }
    if (this.state.Thursday) {
      if (parseInt(this.state.ThursdayStartType) === 0) {
        if (parseInt(this.state.ThursdayStartHour) === 12) {
          thursdayStartTime = parseInt(this.state.ThursdayStartMinute) / 100;
        } else {
          thursdayStartTime =
            parseInt(this.state.ThursdayStartHour) +
            parseInt(this.state.ThursdayStartMinute) / 100;
        }
      } else {
        if (parseInt(this.state.ThursdayStartHour) === 12) {
          thursdayStartTime =
            parseInt(this.state.ThursdayStartHour) +
            parseInt(this.state.ThursdayStartMinute) / 100;
        } else {
          thursdayStartTime =
            parseInt(this.state.ThursdayStartHour) +
            12 +
            parseInt(this.state.ThursdayStartMinute) / 100;
        }
      }

      if (parseInt(this.state.ThursdayEndType) === 0) {
        if (parseInt(this.state.ThursdayEndHour) === 12) {
          thursdayEndTime = parseInt(this.state.ThursdayEndMinute) / 100;
        } else {
          thursdayEndTime =
            parseInt(this.state.ThursdayEndHour) +
            parseInt(this.state.ThursdayEndMinute) / 100;
        }
      } else {
        if (parseInt(this.state.ThursdayEndHour) === 12) {
          thursdayEndTime =
            parseInt(this.state.ThursdayEndHour) +
            parseInt(this.state.ThursdayEndMinute) / 100;
        } else {
          thursdayEndTime =
            parseInt(this.state.ThursdayEndHour) +
            12 +
            parseInt(this.state.ThursdayEndMinute) / 100;
        }
      }
    }
    if (this.state.Friday) {
      if (parseInt(this.state.FridayStartType) === 0) {
        if (parseInt(this.state.FridayStartHour) === 12) {
          fridayStartTime = parseInt(this.state.FridayStartMinute) / 100;
        } else {
          fridayStartTime =
            parseInt(this.state.FridayStartHour) +
            parseInt(this.state.FridayStartMinute) / 100;
        }
      } else {
        if (parseInt(this.state.FridayStartHour) === 12) {
          fridayStartTime =
            parseInt(this.state.FridayStartHour) +
            parseInt(this.state.FridayStartMinute) / 100;
        } else {
          fridayStartTime =
            parseInt(this.state.FridayStartHour) +
            12 +
            parseInt(this.state.FridayStartMinute) / 100;
        }
      }

      if (parseInt(this.state.FridayEndType) === 0) {
        if (parseInt(this.state.FridayEndHour) === 12) {
          fridayEndTime = parseInt(this.state.FridayEndMinute) / 100;
        } else {
          fridayEndTime =
            parseInt(this.state.FridayEndHour) +
            parseInt(this.state.FridayEndMinute) / 100;
        }
      } else {
        if (parseInt(this.state.FridayEndHour) === 12) {
          fridayEndTime =
            parseInt(this.state.FridayEndHour) +
            parseInt(this.state.FridayEndMinute) / 100;
        } else {
          fridayEndTime =
            parseInt(this.state.FridayEndHour) +
            12 +
            parseInt(this.state.FridayEndMinute) / 100;
        }
      }
    }

    let obj = {
      Id: parseInt(this.state.Id),
      Tuition: parseInt(this.state.Tuition),
      Status: this.state.Status,
      Branch: parseInt(this.state.BranchId),
      Startdate: moment(this.state.startdate).format("MM.DD.YYYY"),
      Enddate: moment(this.state.enddate).format("MM.DD.YYYY"),
      Monday: this.state.Monday,
      Tuesday: this.state.Tuesday,
      Wednesday: this.state.Wednesday,
      Thursday: this.state.Thursday,
      Friday: this.state.Friday,
      Course: parseInt(this.state.Course),
      Evaluation: parseInt(this.state.Evaluation),
      Probation: parseInt(this.state.Probation),
      MondayStartTime: parseFloat(mondayStartTime.toFixed(2)),
      TuesdayStartTime: parseFloat(tuesdayStartTime.toFixed(2)),
      WednesdayStartTime: parseFloat(wednesdayStartTime.toFixed(2)),
      ThursdayStartTime: parseFloat(thursdayStartTime.toFixed(2)),
      FridayStartTime: parseFloat(fridayStartTime.toFixed(2)),
      MondayEndTime: parseFloat(mondayEndTime.toFixed(2)),
      TuesdayEndTime: parseFloat(tuesdayEndTime.toFixed(2)),
      WednesdayEndTime: parseFloat(wednesdayEndTime.toFixed(2)),
      ThursdayEndTime: parseFloat(thursdayEndTime.toFixed(2)),
      FridayEndTime: parseFloat(fridayEndTime.toFixed(2)),
    };

    await axios
      .post(Config.ApiUrl + "api/session/add", obj)
      .then((response) => {
        alertify.success(response.data, 4);
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
    history.push("/SessionSearch");
  };
  dayChange = (event) => {
    this.setState({ [event.target.name]: !this.state[event.target.name] });
  };
  timeconvert(time) {
    let converttime = parseInt(
      time.toString().substring(0, time.toString().indexOf("."))
    );
    if (isNaN(converttime)) {
      converttime = parseInt(time);
    }
    if (converttime === 0) return 12;
    else if (converttime > 12) return converttime - 12;
    else return converttime;
  }
  minuteconvert(time) {
    if (time.toString().indexOf(".") === -1) {
      return 0;
    } else {
      let converttime = parseInt(
        time
          .toString()
          .substring(
            time.toString().indexOf(".") + 1,
            time.toString().length + 1
          )
      );
      return converttime;
    }
  }
  isampm(time) {
    let converttime = parseInt(
      time.toString().substring(0, time.toString().indexOf("."))
    );
    if (isNaN(converttime)) {
      converttime = parseInt(time);
    }
    if (converttime < 12) return 0;
    else return 1;
  }
  async componentDidMount() {
    if (this.props.token) {
      this.setState({ IsAdd: true });
      this.setState({ BranchId: this.props.user.userBranches[0].id });
      await axios
        .get(
          Config.ApiUrl +
            "api/course/getbybranchid?branchid=" +
            parseInt(this.props.user.userBranches[0].id)
        )
        .then((c) => {
          this.setState({ Courses: c.data });
          if (c.data.length > 0) {
            this.setState({ Course: c.data[0].id });
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
      // await axios
      //   .get(Config.ApiUrl + "api/course/getall")
      //   .then((c) => {
      //     this.setState({ Courses: c.data });
      //   })
      //   .catch((error) => {
      //     console.log(error.response);
      //   });

      await axios
        .get(Config.ApiUrl + "api/evaluation/getall")
        .then((e) => {
          this.setState({ Evaluations: e.data });
        })
        .catch((error) => {
          console.log(error.response);
        });
      this.setState({ Evaluation: this.state.Evaluations[0].id });
      this.setState({ Course: this.state.Courses[0].id });
      if (history.location.state) {
        this.setState({ IsAdd: false });
        await axios
          .get(
            Config.ApiUrl +
              "api/session/getbyid?sessionid=" +
              history.location.state.id
          )
          .then((r) => {
            if(r.data.monday)
            {
             this.setState({MondayStartType:parseInt(this.isampm(r.data.mondayStartTime)) });
             this.setState({MondayStartMinute:parseInt(this.minuteconvert(r.data.mondayStartTime)) });
             this.setState({MondayStartHour:parseInt(this.timeconvert(r.data.mondayStartTime)) });
             this.setState({MondayStartType:parseInt(this.isampm(r.data.mondayEndTime)) });
             this.setState({MondayStartMinute:parseInt(this.minuteconvert(r.data.mondayEndTime)) });
             this.setState({MondayStartHour:parseInt(this.timeconvert(r.data.mondayEndTime)) });
            }
            if(r.data.tuesday)
            {
              this.setState({TuesdayStartType:parseInt(this.isampm(r.data.tuesdayStartTime)) });
              this.setState({TuesdayStartMinute:parseInt(this.minuteconvert(r.data.tuesdayStartTime)) });
              this.setState({TuesdayStartHour:parseInt(this.timeconvert(r.data.tuesdayStartTime)) });
              this.setState({TuesdayEndType:parseInt(this.isampm(r.data.tuesdayEndTime)) });
              this.setState({TuesdayEndMinute:parseInt(this.minuteconvert(r.data.tuesdayEndTime)) });
              this.setState({TuesdayEndHour:parseInt(this.timeconvert(r.data.tuesdayEndTime)) });
            }
            if(r.data.wednesday)
            {
              this.setState({WednesdayStartType:parseInt(this.isampm(r.data.wednesdayStartTime)) });
              this.setState({WednesdayStartMinute:parseInt(this.minuteconvert(r.data.wednesdayStartTime)) });
              this.setState({WednesdayStartHour:parseInt(this.timeconvert(r.data.wednesdayStartTime)) });
              this.setState({WednesdayEndType:parseInt(this.isampm(r.data.wednesdayEndTime)) });
              this.setState({WednesdayEndMinute:parseInt(this.minuteconvert(r.data.wednesdayEndTime)) });
              this.setState({WednesdayEndHour:parseInt(this.timeconvert(r.data.wednesdayEndTime)) });
            }
            if(r.data.thursday)
            {
              this.setState({ThursdayStartType:parseInt(this.isampm(r.data.thursdayStartTime)) });
              this.setState({ThursdayStartMinute:parseInt(this.minuteconvert(r.data.thursdayStartTime)) });
              this.setState({ThursdayStartHour:parseInt(this.timeconvert(r.data.thursdayStartTime)) });
              this.setState({ThursdayEndType:parseInt(this.isampm(r.data.thursdayEndTime)) });
              this.setState({ThursdayEndMinute:parseInt(this.minuteconvert(r.data.thursdayEndTime)) });
              this.setState({ThursdayEndHour:parseInt(this.timeconvert(r.data.thursdayEndTime)) });
            }
            if(r.data.friday)
            {
              this.setState({FridayStartType:parseInt(this.isampm(r.data.fridayStartTime)) });
              this.setState({FridayStartMinute:parseInt(this.minuteconvert(r.data.fridayStartTime)) });
              this.setState({FridayStartHour:parseInt(this.timeconvert(r.data.fridayStartTime)) });
              this.setState({FridayEndType:parseInt(this.isampm(r.data.fridayEndTime)) });
              this.setState({FridayEndMinute:parseInt(this.minuteconvert(r.data.fridayEndTime)) });
              this.setState({FridayEndHour:parseInt(this.timeconvert(r.data.fridayEndTime)) });
            }
            this.setState({ Id: r.data.id });
            this.setState({ BranchId: r.data.branch });
            this.setState({ Monday: r.data.monday });
            this.setState({ Tuesday: r.data.tuesday });
            this.setState({ Wednesday: r.data.wednesday });
            this.setState({ Thursday: r.data.thursday });
            this.setState({ Friday: r.data.friday });
            this.setState({ Status: r.data.status });
            this.setState({ Tuition: r.data.tuition });
            this.setState({ Evaluation: r.data.evaluation });
            this.setState({ Course: r.data.course });
            this.setState({ Probation: r.data.probation });
            this.setState({
              startdate: new Date(
                moment(r.data.startDate).format("YYYY,MM,DD")
              ),
            });
            this.setState({
              enddate: new Date(moment(r.data.endDate).format("YYYY,MM,DD")),
            });
          })
          .catch((error) => {
            console.log(error.response);
          });
      } else {
      }
    } else {
    }
  }
  startDateChange = (date) => {
    this.setState({
      startdate: date,
    });
  };
  endDateChange = (date) => {
    this.setState({
      enddate: date,
    });
  };

  render() {
    return (
      <div>
        {this.state.IsAdd && <h1 className="content-title">Add Sessions</h1>}
        {!this.state.IsAdd && (
          <h1 className="content-title"> Sessions Update</h1>
        )}
        <form onSubmit={this.onSubmitHandler}>
          <div className="row">
            {this.state.IsAdd && (
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="Branch">Branch:</label>
                <div className="form-select">
                  <select
                    className="form-control"
                    type="select"
                    name="BranchId"
                    id="BranchId"
                    onChange={this.onBranchChangeHandler}
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
            {this.state.IsAdd && (
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="Course">Course:</label>
                <div className="form-select">
                  <select
                    className="form-control"
                    value={this.state.Course}
                    type="select"
                    name="Course"
                    id="Course"
                    required
                    onChange={this.onChangeHandler}
                  >
                    {this.state.Courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="exampleDate">Start Date:</label>
              <div className="form-select">
                <DatePicker
                  className="form-control"
                  selected={this.state.startdate}
                  onChange={this.startDateChange}
                />
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="exampleDate">End Date:</label>
              <div className="form-select">
                <DatePicker
                  className="form-control"
                  selected={this.state.enddate}
                  onChange={this.endDateChange}
                />
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="exampleEmail">Tuition</label>
              <input
                className="form-control"
                type="number"
                name="Tuition"
                id="Tuition"
                value={this.state.Tuition}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="exampleEmail">Probation "Max Absence"</label>
              <input
                className="form-control"
                type="number"
                name="Probation"
                id="Probation"
                value={this.state.Probation}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3 d-flex align-items-center">
              <label className="form-csCheck remember-me">
                <input
                  className="form-check-input form-control validate"
                  name="Monday"
                  checked={this.state.Monday}
                  type="checkbox"
                  onChange={this.dayChange}
                />
                <span className="form-csCheck-checkmark"></span>
                Monday
              </label>
              {this.state.Monday && (
                <div>
                  <div className="row">
                    <span>Start:</span>
                    <select
                      className=""
                      type="select"
                      name="MondayStartType"
                      id="MondayStartType"
                      value={this.state.MondayStartType}
                      onChange={this.onChangeHandler}
                    >
                      <option value="0">AM</option>
                      <option value="1">PM</option>
                    </select>
                    <div className="form-group">
                      <input
                        value={this.state.MondayStartHour}
                        name="MondayStartHour"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="1"
                        max="12"
                      />
                      <input
                        value={this.state.MondayStartMinute}
                        name="MondayStartMinute"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <span>End:</span>
                    <select
                      className=""
                      type="select"
                      name="MondayEndType"
                      id="MondayEndType"
                      value={this.state.MondayEndType}
                      onChange={this.onChangeHandler}
                    >
                      <option value="0">AM</option>
                      <option value="1">PM</option>
                    </select>
                    <div className="form-group">
                      <input
                        value={this.state.MondayEndHour}
                        name="MondayEndHour"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="1"
                        max="12"
                      />
                      <input
                        value={this.state.MondayEndMinute}
                        name="MondayEndMinute"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3 d-flex align-items-center">
              <label className="form-csCheck remember-me">
                <input
                  className="form-check-input form-control validate"
                  name="Tuesday"
                  checked={this.state.Tuesday}
                  type="checkbox"
                  onChange={this.dayChange}
                />
                <span className="form-csCheck-checkmark"></span>
                Tuesday
              </label>
              {this.state.Tuesday && (
                <div>
                  <div className="row">
                    <span>Start:</span>
                    <select
                      className=""
                      type="select"
                      name="TuesdayStartType"
                      id="TuesdayStartType"
                      value={this.state.TuesdayStartType}
                      onChange={this.onChangeHandler}
                    >
                      <option value="0">AM</option>
                      <option value="1">PM</option>
                    </select>
                    <div className="form-group">
                      <input
                        value={this.state.TuesdayStartHour}
                        name="TuesdayStartHour"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="1"
                        max="12"
                      />
                      <input
                        value={this.state.TuesdayStartMinute}
                        name="TuesdayStartMinute"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <span>End:</span>
                    <select
                      className=""
                      type="select"
                      name="TuesdayEndType"
                      id="TuesdayEndType"
                      value={this.state.TuesdayEndType}
                      onChange={this.onChangeHandler}
                    >
                      <option value="0">AM</option>
                      <option value="1">PM</option>
                    </select>
                    <div className="form-group">
                      <input
                        value={this.state.TuesdayEndHour}
                        name="TuesdayEndHour"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="1"
                        max="12"
                      />
                      <input
                        value={this.state.TuesdayEndMinute}
                        name="TuesdayEndMinute"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3 d-flex align-items-center">
              <label className="form-csCheck remember-me">
                <input
                  className="form-check-input form-control validate"
                  name="Wednesday"
                  checked={this.state.Wednesday}
                  type="checkbox"
                  onChange={this.dayChange}
                />
                <span className="form-csCheck-checkmark"></span>
                Wednesday
              </label>
              {this.state.Wednesday && (
                <div>
                  <div className="row">
                    <span>Start:</span>
                    <select
                      className=""
                      type="select"
                      name="WednesdayStartType"
                      id="WednesdayStartType"
                      value={this.state.WednesdayStartType}
                      onChange={this.onChangeHandler}
                    >
                      <option value="0">AM</option>
                      <option value="1">PM</option>
                    </select>
                    <div className="form-group">
                      <input
                        value={this.state.WednesdayStartHour}
                        name="WednesdayStartHour"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="1"
                        max="12"
                      />
                      <input
                        value={this.state.WednesdayStartMinute}
                        name="WednesdayStartMinute"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <span>End:</span>
                    <select
                      className=""
                      type="select"
                      name="WednesdayEndType"
                      id="WednesdayEndType"
                      value={this.state.WednesdayEndType}
                      onChange={this.onChangeHandler}
                    >
                      <option value="0">AM</option>
                      <option value="1">PM</option>
                    </select>
                    <div className="form-group">
                      <input
                        value={this.state.WednesdayEndHour}
                        name="WednesdayEndHour"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="1"
                        max="12"
                      />
                      <input
                        value={this.state.WednesdayEndMinute}
                        name="WednesdayEndMinute"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3 d-flex align-items-center">
              <label className="form-csCheck remember-me">
                <input
                  className="form-check-input form-control validate"
                  name="Thursday"
                  checked={this.state.Thursday}
                  type="checkbox"
                  onChange={this.dayChange}
                />
                <span className="form-csCheck-checkmark"></span>
                Thursday
              </label>
              {this.state.Thursday && (
                <div>
                  <div className="row">
                    <span>Start:</span>
                    <select
                      className=""
                      type="select"
                      name="ThursdayStartType"
                      id="ThursdayStartType"
                      value={this.state.ThursdayStartType}
                      onChange={this.onChangeHandler}
                    >
                      <option value="0">AM</option>
                      <option value="1">PM</option>
                    </select>
                    <div className="form-group">
                      <input
                        value={this.state.ThursdayStartHour}
                        name="ThursdayStartHour"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="1"
                        max="12"
                      />
                      <input
                        value={this.state.ThursdayStartMinute}
                        name="ThursdayStartMinute"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <span>End:</span>
                    <select
                      className=""
                      type="select"
                      name="ThursdayEndType"
                      id="ThursdayEndType"
                      value={this.state.ThursdayEndType}
                      onChange={this.onChangeHandler}
                    >
                      <option value="0">AM</option>
                      <option value="1">PM</option>
                    </select>
                    <div className="form-group">
                      <input
                        value={this.state.ThursdayEndHour}
                        name="ThursdayEndHour"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="1"
                        max="12"
                      />
                      <input
                        value={this.state.ThursdayEndMinute}
                        name="ThursdayEndMinute"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3  d-flex align-items-center">
              <label className="form-csCheck remember-me">
                <input
                  className="form-check-input form-control validate"
                  name="Friday"
                  checked={this.state.Friday}
                  type="checkbox"
                  onChange={this.dayChange}
                />
                <span className="form-csCheck-checkmark"></span>
                Friday
              </label>
              {this.state.Friday && (
                <div>
                  <div className="row">
                    <span>Start:</span>
                    <select
                      className=""
                      type="select"
                      name="FridayStartType"
                      id="FridayStartType"
                      value={this.state.FridayStartType}
                      onChange={this.onChangeHandler}
                    >
                      <option value="0">AM</option>
                      <option value="1">PM</option>
                    </select>
                    <div className="form-group">
                      <input
                        value={this.state.FridayStartHour}
                        name="FridayStartHour"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="1"
                        max="12"
                      />
                      <input
                        value={this.state.FridayStartMinute}
                        name="FridayStartMinute"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <span>End:</span>
                    <select
                      className=""
                      type="select"
                      name="FridayEndType"
                      id="FridayEndType"
                      value={this.state.FridayEndType}
                      onChange={this.onChangeHandler}
                    >
                      <option value="0">AM</option>
                      <option value="1">PM</option>
                    </select>
                    <div className="form-group">
                      <input
                        value={this.state.FridayEndHour}
                        name="FridayEndHour"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="1"
                        max="12"
                      />
                      <input
                        value={this.state.FridayEndMinute}
                        name="FridayEndMinute"
                        onChange={this.onChangeHandler}
                        type="number"
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                </div>
              )}
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

            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Course">Evaluation:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  value={this.state.Evaluation}
                  type="select"
                  name="Evaluation"
                  id="Evaluation"
                  onChange={this.onChangeHandler}
                >
                  {this.state.Evaluations.map((evaluation) => (
                    <option key={evaluation.id} value={evaluation.id}>
                      {evaluation.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <Button type="submit" color="success" disabled={this.state.Loading}>
            {this.state.Loading && <i className="fa fa-refresh fa-spin"></i>}
            {!this.state.Loading && <span> Save</span>}
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
export default connect(mapStateToProps)(AddSession);
