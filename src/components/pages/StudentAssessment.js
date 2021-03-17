import React, { Component } from "react";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import history from "../../history";
import * as Config from "../../config";
class StudentAssessment extends Component {
  state = {
    Titles: [],
    Students: [],
    SavedList: [],
    AssessmentList:[],
    CommentList:[],
    Loading:false,
  };
  async Save(){
    this.setState({ Loading: true });
    let sendlist=[];
    for (let index = 0; index < this.state.CommentList.length; index++) {
      
     if(this.state.CommentList[index].edit)
     {
        let obj={
          UserId:parseInt(this.state.CommentList[index].userId),
          SessionId:parseInt(this.state.CommentList[index].sessionId),
          Comment:this.state.CommentList[index].comment,
        }
        sendlist.push(obj);
     } 
    }
    await axios
    .post(Config.ApiUrl + "api/studentcourse/comentsave", sendlist)
    .then((response) => {
    })
    .catch((error) => {
      alertify.error(error.response.data, 4);
    });

    await axios
    .post(Config.ApiUrl + "api/studentassessment/saveassessments", this.state.SavedList)
    .then((response) => {
      alertify.success(response.data, 4);
    })
    .catch((error) => {
      alertify.error(error.response.data, 4);
    });

  this.setState({ Loading: false });
      //history.push("/SessionSearch");
  }
  getnote(assessment,student){

     for (let index = 0; index < this.state.AssessmentList.length; index++) {
      if (assessment.assessmentId===this.state.AssessmentList[index].assessmentId && student.id===this.state.AssessmentList[index].userId) {
        return this.state.AssessmentList[index].note;
      }
     }
     return 0;
  }
  getcomment(userid)
  {
    for (let index = 0; index < this.state.CommentList.length; index++) {
      if (parseInt(userid)===parseInt(this.state.CommentList[index].userId)) {
        return this.state.CommentList[index].comment;
      }
     }
     return "";
  }
  async getdata(sessionid)
  {
    await axios
    .get(
      Config.ApiUrl +
        "api/studentassessment/getbysessionid?sessionid=" +
        sessionid
    )
    .then((r) => {
      this.setState({ Titles: r.data.evaluationAssessments });
      this.setState({ Students: r.data.users });
    })
    .catch((error) => {
      console.log(error.response);
    });
    await axios
    .get(
      Config.ApiUrl +
        "api/studentassessment/getbyassessmentsessionid?sessionid=" +
        sessionid
    )
    .then((r) => {
      this.setState({AssessmentList:r.data});
      var OldSavedList=[];
      for (let index = 0; index < r.data.length; index++) {
        var saveobj = {
          AssessmentId: parseInt(r.data[index].assessmentId),
          SessionId: parseInt(r.data[index].sessionId),
          UserId: parseInt(r.data[index].userId),
          Note: parseInt(r.data[index].note),
        };
        OldSavedList.push(saveobj);
      }
      this.setState({SavedList:OldSavedList});
      
    })
    .catch((error) => {
      console.log(error.response);
    });
    await axios
    .get(
      Config.ApiUrl +
        "api/studentcourse/getcommentlist?sessionid=" +
        sessionid
    )
    .then((r) => {
      this.setState({CommentList:r.data});
    })
    .catch((error) => {
      console.log(error.response);
    });
  }
  async componentDidMount() {
    if (this.props.token) {
      if (history.location.state) {
        this.getdata(history.location.state.id);
      }
      else
      {
        this.getdata(this.props.sessionid);
      }
    }
  }

  handleChange = (studentid, assessmentid, e) => {
    
    let add = true;
    let oldlist = this.state.SavedList;
    
    let note = parseInt(e.target.value);
    for (let index = 0; index < oldlist.length; index++) {
      if (
        oldlist[index].UserId === parseInt(studentid) &&
        oldlist[index].AssessmentId === parseInt(assessmentid)
      ) {
        oldlist[index].Note = note;
        add = false;
      }
    }
    if (add === true) {
      let saveobj = {
        AssessmentId: parseInt(assessmentid),
        SessionId:history.location.state? parseInt(history.location.state.id):parseInt(this.props.sessionid),
        UserId: parseInt(studentid),
        Note: note,
      };
      oldlist.push(saveobj);
    }
    this.setState({ SavedList: oldlist });
  };
  commendChange = (userid, e) => {
    let comment = e.target.value;
    let newlist=[];
    for (let index = 0; index < this.state.CommentList.length; index++) {
      if (parseInt(userid)===parseInt(this.state.CommentList[index].userId)) {
        let obj=this.state.CommentList[index];
        obj.comment=comment;
        obj.edit=true;
        newlist.push(obj);
      }
      else
      {
        let obj=this.state.CommentList[index];
        newlist.push(obj);
      }
     }
     this.setState({CommentList:newlist});
  };
  render() {
    return (
      <div>
        <h2>Student Assessment</h2>
        <div className="row">
          <div className="col-12">
            <div className="table-wrapper">
              <div className="table reponsive-table">
                <div className="ttop">
                  <div className="thead">
                    <div className="tr">
                      <div className="td">Student</div>
                      {this.state.Titles.map((val) => (
                        <div className="td" key={val.assessmentId}>
                          {val.assessment} (%{val.effectRation})
                        </div>
                      ))}
                    <div className="td">Comment</div>
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
                        {this.state.Titles.map((assessment) => (
                          <div className="td" key={assessment.assessmentId}>
                            <input
                              type="number"
                              placeholder={this.getnote(assessment,student)}
                              onChange={(e) =>
                                this.handleChange(
                                  student.id,
                                  assessment.assessmentId,
                                  e
                                )
                              }
                            />
                          </div>
                        ))}
                         <div className="td">
                         <textarea
                              className="form-control"
                              value={this.getcomment(student.id)}
                              onChange={(e) =>
                                this.commendChange(
                                  student.id,
                                  e
                                )
                              }
                         />
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <button  type="button" className="btn btn-primary mt-2 col-2" disabled={this.state.Loading} onClick={()=>this.Save()}>
            {this.state.Loading && <i className="ri-loader-4-line ri-spin"></i>}
            {!this.state.Loading && <span> Save</span>}
            {this.state.Loading && <span> Wait ...</span>}
          </button>
         

        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(StudentAssessment);
