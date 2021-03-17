import React, { Component } from 'react'
import axios from 'axios';
import alertify from 'alertifyjs';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import history from '../../history';
import * as Config from '../../config';
class StudentMain extends Component {
    state={
        CourseView: [],
    }
    async componentDidMount(){
        await axios
        .get(
          Config.ApiUrl +
            'api/studentcourse/getbyuserid?userid=' +
            parseInt(this.props.user.id)
        )
        .then((c) => {
            
            let viewlist=[];
          for (let index = 0; index < c.data.length; index++) {
            var viewobj = {
              Id: c.data[index].id,
              Course: c.data[index].courseName,
              StartDate: c.data[index].startDate,
              EndDate: c.data[index].endDate,
              Teacher: c.data[index].teacher,
              Class: c.data[index].classroom,
              AssessmentGrade: c.data[index].assessmentGrade,
              ParticipationGrade: '',
              TotalGrade: '',
              Comment: c.data[index].comment,
              ConditionalPass: c.data[index].conditionalPass,
              Incomplete: c.data[index].incomplete,
            };
            viewlist.push(viewobj);
          }
          this.setState({CourseView:viewlist});
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
    render() {
        return (
            <div>
                <div className="content-title">Student Main</div>  
                <div className="row">   
                <div className="col-12">
                <div className="table-wrapper">
                  <div className="table">
                    <div className="ttop">
                      <div className="thead">
                        <div className="tr">
                          <div className="th">Course</div>
                          <div className="th">Start Date End Date</div>
                          <div className="th">Teacher Class</div>
                          <div className="th">Assessment Grade</div>
                          <div className="th">Comment</div>
                          <div className="th">Conditional Pass</div>
                          <div className="th">Incomplete</div>               
                        </div>
                      </div>
                      <div className="tbody">
                        {this.state.CourseView.map((courseview) => (
                          <div className="tr" key={courseview.Id}>
                            <div className="td">{courseview.Course}</div>
                            <div className="td"> {courseview.StartDate} {courseview.EndDate}</div>
                            <div className="td">{courseview.Teacher} - {courseview.Class} </div>
                            <div className="td"> {courseview.AssessmentGrade}</div>
                            <div className="td">{courseview.Comment}</div>
                            <div className="td">
                                <label className="form-csCheck remember-me">
                                  <input
                                    className="form-check-input form-control validate"
                                    checked={courseview.ConditionalPass}
                                    type="checkbox"
                                    disabled    
                                  />
                                  <span className="form-csCheck-checkmark"></span>
                                </label>
                            </div>
                            <div className="td">
                                <label className="form-csCheck remember-me">
                                  <input
                                    className="form-check-input form-control validate"
                                    checked={courseview.Incomplete}
                                    type="checkbox"      
                                    disabled   
                                  />
                                  <span className="form-csCheck-checkmark"></span>
                                </label>
                            </div>      
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return { token: state.authReducer };
  }
  export default connect(mapStateToProps)(StudentMain);
