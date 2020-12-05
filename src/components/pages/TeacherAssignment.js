import React, { Component } from "react";
import history from "../../history";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import * as moment from "moment";
import * as Config from "../../config";
class TeacherAssignment extends Component {
  state = {
    date: new Date(),
    Views: [],
    Loading: false,
    Year:new Date().getFullYear(),
    Month: new Date().getMonth() + 1,
    Months:["January","February","March","April","May","June","July","August","September","October","November","December"],
    Years:["2019","2020","2021","2022","2023","2024","2025","2026","2027","2028","2029","2030"],
  };
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  onMonthChangeHandler = (event) => {
    let value = event.target.value;
    this.setState({Month: value });
  };
  async componentDidMount() {
    if (this.props.token) {
      if (history.location.state) {
        console.log(history.location.state.id);
        this.setState({ IsAdd: false });
        let obj = {
          TeacherId: history.location.state.id,
          Date: moment(this.state.date).format("MM.DD.YYYY"),
        };
        await axios
          .post(Config.ApiUrl + "api/assignment/getbyteacherassignment", obj)
          .then((response) => {
            this.setState({ Views: response.data });
            console.log(response.data);
          })
          .catch((error) => {
            alertify.error(error.response.data, 4);
          });
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
              <label htmlFor="Year">Year:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  name="Year"
                  id="Year"
                  onChange={this.onChangeHandler}
                  value={this.state.Year}
                >
                {this.state.Years.map((title, index) => {
                  return (
                    <option key={`day-${index}`} value={title}> {title} </option>
                  );
                })}
                </select>
              </div>
            </div>

            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Month">Month:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  name="Month"
                  id="Month"
                  onChange={this.onMonthChangeHandler}
                  value={this.state.Month}
                >
                 {this.state.Months.map((title, index) => {
                  return (
                    <option key={`month-${index}`} value={index+1}> {title} </option>
                  );
                })}
                </select>
              </div>
            </div>
    
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="DaysInWeek">Week:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  name="DaysInWeek"
                  id="DaysInWeek"
                  onChange={this.onDayChangeHandler}
                  value={this.state.DaysInWeek}
                >
                  <option value="0"> All </option>
                  <option value="1"> 1 Days </option>
                  <option value="2"> 2 Days </option>
                  <option value="3"> 3 Days </option>
                  <option value="4"> 4 Days </option>
                  <option value="5"> 5 Days </option>
                </select>
              </div>
            </div>

            <div className="form-group col-12 col-sm-6 col-lg-3">
              <Button
                color="primary"
                type="submit"
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
        <div className="table-wrapper">
          <div className="table reponsive-table">
            <div className="ttop">
              <div className="thead">
                <div className="tr">
                  <div className="td">Course</div>
                  <div className="td">Start Date</div>
                  <div className="td">End Date</div>
                  <div className="td">Class</div>
                  <div className="td">Monday</div>
                  <div className="td">Tuesday</div>
                  <div className="td">Wednesday</div>
                  <div className="td">Thursday</div>
                  <div className="td">Friday</div>
                  <div className="td">Total</div>
                </div>
              </div>
              <div className="tbody">
                {this.state.Views.map((title, index) => {
                  return (
                    <div key={`course-${index}`} className="tr">
                      <div className="td">{title.courseName}</div>
                      <div className="td">
                        {moment(title.courseStart).format("MM.DD.YYYY")}
                      </div>
                      <div className="td">
                        {moment(title.courseEnd).format("MM.DD.YYYY")}
                      </div>
                      <div className="td">{title.class}</div>

                      <div className="td">{title.monday.toFixed(2)}</div>
                      <div className="td">{title.tuesday.toFixed(2)}</div>
                      <div className="td">{title.wednesday.toFixed(2)}</div>
                      <div className="td">{title.thursday.toFixed(2)}</div>
                      <div className="td">{title.friday.toFixed(2)}</div>
                      <div className="td">
                        {parseFloat(title.monday) +
                          parseFloat(title.wednesday) +
                          parseFloat(title.thursday) +
                          parseFloat(title.friday)}
                      </div>
                    </div>
                  );
                })}
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
