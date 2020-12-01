import React, { Component } from "react";
import history from "../../history";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import * as moment from "moment";
import * as Config from "../../config";
class TeacherAssignment extends Component {
  state = {
    date: new Date(),
    Views: [],
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
                    <div key={index} className="tr">
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
