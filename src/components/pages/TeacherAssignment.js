import React, { Component } from "react";
import history from "../../history";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import DatePicker from "react-datepicker";
import * as moment from "moment";
import * as Config from "../../config";
class TeacherAssignment extends Component {
  state = {
    startdate: new Date(),
    enddate: new Date(),
    TeacherId: 0,
    Views: [],
    Loading: false,
    Total: 0,
  };
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
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
  onSubmitHandler = async (event) => {
    event.preventDefault();
    let obj = {
      TeacherId: parseInt(this.state.TeacherId),
      StartDate: moment(this.state.startdate).format("MM.DD.YYYY"),
      EndDate: moment(this.state.enddate).format("MM.DD.YYYY"),
    };
    await axios
      .post(Config.ApiUrl + "api/assignment/getbyteacherassignment", obj)
      .then((response) => {
        this.setState({ Views: response.data.data });
        this.setState({ Total: response.data.total });
        console.log(this.state.Views);
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
  };
  async componentDidMount() {
    if (this.props.token) {
      if (history.location.state) {
        this.setState({ TeacherId: history.location.state.id });
      } else {
      }
    } else {
    }
  }
  render() {
    return (
      <div>
        <h1>Teacher Assignment</h1>
        <form onSubmit={this.onSubmitHandler}>
          <div className="row align-items-end">
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
              <Button
                color="primary"
                type="submit"
                disabled={this.state.Loading}
              >
                {this.state.Loading && (
                  <i className="ri-loader-4-line ri-spin"></i>
                )}
                {!this.state.Loading && <span> Search</span>}
                {this.state.Loading && <span> Wait ...</span>}
              </Button>
            </div>
          </div>
        </form>
        <div className="table-wrapper">
          <div className="table reponsive-table">
            <div className="ttop">
              <div className="thead">
                <div className="tr">
                  <div className="td">Date</div>
                  <div className="td">Course</div>
                  <div className="td">Class</div>
                  <div className="td">Course Start Date</div>
                  <div className="td">Course End Date</div>
                  <div className="td">Time</div>

                  {/* <div className="td">Course</div>
                  <div className="td">Start Date</div>
                  <div className="td">End Date</div>
                  <div className="td">Class</div>
                  <div className="td">Total</div> */}
                </div>
              </div>
              <div className="tbody">
                {this.state.Views.map((title, index) => {
                  return (
                    <div key={`date-${index}`} className="tr">
                      <div className="td">
                        {moment(title.date).format("MM.DD.YYYY")}
                      </div>
                      <div className="td double-row">
                        {title.assignments.map(
                          (assignmenttitle, assignmentindex) => {
                            return (
                              <div
                                key={"courseName" + assignmentindex}
                                className="tr"
                              >
                                {assignmenttitle.courseName}
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="td double-row">
                        {title.assignments.map(
                          (assignmenttitle, assignmentindex) => {
                            return (
                              <div
                                key={"courseName" + assignmentindex}
                                className="tr"
                              >
                                {assignmenttitle.class}
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="td double-row">
                        {title.assignments.map(
                          (assignmenttitle, assignmentindex) => {
                            return (
                              <div
                                key={"courseName" + assignmentindex}
                                className="tr"
                              >
                                {moment(assignmenttitle.courseStart).format(
                                  "MM.DD.YYYY"
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="td double-row">
                        {title.assignments.map(
                          (assignmenttitle, assignmentindex) => {
                            return (
                              <div
                                key={"courseName" + assignmentindex}
                                className="tr"
                              >
                                {moment(assignmenttitle.courseEnd).format(
                                  "MM.DD.YYYY"
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>

                      <div className="td double-row">
                        {title.assignments.map(
                          (assignmenttitle, assignmentindex) => {
                            return (
                              <div
                                key={"courseName" + assignmentindex}
                                className="tr"
                              >
                                {assignmenttitle.time.toFixed(2)}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
                {this.state.Views.length ? (
                  <div className="tr bold">
                    <div class="td">TOTAL:</div>
                    <div class="td"></div>
                    <div class="td"></div>
                    <div class="td"></div>
                    <div class="td"></div>
                    <div class="td">{this.state.Total}</div>
                  </div>
                ) : null}
              </div>
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
export default connect(mapStateToProps)(TeacherAssignment);
