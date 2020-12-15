import React, { Component } from "react";
import {Button,Table } from "reactstrap";
import history from "../../history";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import * as Config from "../../config";
class AddEvaluation extends Component {
  state = {
    Id: 0,
    Name: "",
    Description: "",
    Status: true,
    BranchId: "",
    PassingGrade: 70.0,
    Loading: false,
    IsAdd: true,
    Assessments: [],
    Assessment: 0,
    EffectRation: 0.0,
    EvaluationAssessments:[],
  };
  onChangeHandler = event => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  onActiveHandler = event => {
    switch (event.target.value) {
      case "true":
        this.setState({ Status: true });
        break;

      default:
        this.setState({ Status: false });
        break;
    }
  };
  assessmentSubmit = async event => {
    event.preventDefault();
    let total=0;
    for (let index = 0; index < this.state.EvaluationAssessments.length; index++) {
      total = parseInt(this.state.EvaluationAssessments[index].effectRation)+total;      
    }
    total+=parseInt(this.state.EffectRation)
    if(total>100)
    {
      alertify.error("Total effectRation cannot exceed one hundred percent");
    }
    else
    {
      this.setState({ Loading: true });
      var newlist = this.state.EvaluationAssessments;
      let obj = {
        EvaluationId: parseInt(this.state.Id),
        EffectRation:parseFloat(this.state.EffectRation),
        AssessmentId:parseInt(this.state.Assessment)
      };  
      await axios
        .post(Config.ApiUrl + "api/evaluationAssessment/add", obj)
        .then(response => {
            newlist.push(response.data.data);
            this.setState({EvaluationAssessments:newlist});
          
            alertify.success(response.data.message, 4);
        })
        .catch(error => {
          alertify.error(error.response.data, 4);
        });
      this.setState({ Loading: false });
    }


  };
  onSubmitHandler = async event => {
    event.preventDefault();
    this.setState({ Loading: true });
    let obj = {
      Id: parseInt(this.state.Id),
      Name: this.state.Name,
      Description: this.state.Description,
      PassingGrade: parseFloat(this.state.PassingGrade),
      Status: this.state.Status,
      BranchId: parseInt(this.state.BranchId)
    };
    await axios
      .post(Config.ApiUrl + "api/evaluation/add", obj)
      .then(response => {
        if (this.state.Id === 0) {
          this.setState({ Id: parseInt(response.data.data.id) });
          alertify.success(response.data.message, 4);
        } else {
          alertify.success(response.data, 4);
        }
      })
      .catch(error => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
    // history.push("/EvaluationSearch");
  };
  async deleteEvaluationAssessment (e) {
    this.setState({ Loading: true });
    await axios
    .post(Config.ApiUrl + "api/evaluationassessment/delete", e)
    .then(response => {
      var obj=this.state.EvaluationAssessments;
      var index=obj.findIndex(x => x.id === parseInt(e.id));
     //  obj=obj.splice([this.state.EvaluationAssessments.findIndex(x => x.id === parseInt(e.id))],1);
      var left=obj.slice(0,index);
      var right=obj.slice(index+1,obj.length);
      var leftright=left.concat(right);
 
      this.setState({EvaluationAssessments:leftright});
  
      alertify.warning(response.data,4);
    })
    .catch(error => {
      alertify.error(error.response.data, 4);
    });
  this.setState({ Loading: false });
  };
  async componentDidMount() {
    await axios
      .get(Config.ApiUrl + "api/assessment/getall")
      .then(a => {
        this.setState({ Assessments: a.data });
        this.setState({ Assessment: this.state.Assessments[0].id });
      })
      .catch(error => {
        console.log(error.response);
      });

  
    if (this.props.token) {
      this.setState({ IsAdd: true });
      this.setState({ BranchId: this.props.user.userBranches[0].id });
      if (history.location.state) {
        this.setState({ IsAdd: false });
        await axios
          .get(
            Config.ApiUrl + "api/evaluation/getbyid?evaluationid=" +
              history.location.state.id
          )
          .then(r => {
            this.setState({ Name: r.data.name });
            this.setState({ Description: r.data.description });
            this.setState({ Status: r.data.status });
            this.setState({ BranchId: r.data.branchId });
            this.setState({ Id: r.data.id });
            this.setState({ PassingGrade: r.data.passingGrade });
          })
          .catch(error => {
            console.log(error.response);
          });

          await axios
          .get(
            Config.ApiUrl + "api/evaluationAssessment/getListbyevaluationId?evaluationAssessmentid=" +  history.location.state.id
          )
          .then(e => {
            this.setState({ EvaluationAssessments: e.data });
          })
          .catch(error => {
            console.log(error.response);
          });

      } else {
      }
    } else {
    }
  }
  render() {
    return (
      <div>
        {this.state.IsAdd && <div className="content-title">Add Evaluation</div>}
        {!this.state.IsAdd && <div className="content-title"> Update Evaluation</div>}
        <form onSubmit={this.onSubmitHandler}>
        <div className="row">
           	<div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="Name">Name:</label>
                <input
                className="form-control"
                  value={this.state.Name}
                  name="Name"
                  id="Name"
                  onChange={this.onChangeHandler}
                  required
                />
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
                <label htmlFor="PassingGrade">PassingGrade:</label>
                <input
                className="form-control"
                  value={this.state.PassingGrade}
                  name="PassingGrade"
                  id="PassingGrade"
                  onChange={this.onChangeHandler}
                  type="number"
                  step="0.1"
                  required
                />
          </div>
    
        
            {this.state.IsAdd && (
                <div className="form-group col-12 col-sm-6 col-lg-3">
                  <label htmlFor="Branch">Branch:</label>
                  <div className="form-select">
                  <select
                  className="form-control"
                    name="BranchId"
                    id="BranchId"
                    onChange={this.onChangeHandler}
                  >
                    {this.props.user.userBranches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  </div>
             </div>
            )}
              </div>
              <div className="row">
                  <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="Description">Description:</label>
                <textarea
                className="form-control"
                  value={this.state.Description}
                  name="Description"
                  id="Description"
                  onChange={this.onChangeHandler}
           
                  required
                />
          </div>
          </div>
          <Button type="submit" color="success" disabled={this.state.Loading}>
            {this.state.Loading && <i className="ri-loader-4-line ri-spin"></i>}
            {!this.state.Loading && <span> Add</span>}
            {this.state.Loading && <span> Wait ...</span>}
          </Button>
        </form>
        {this.state.Id !== 0 && (
          <div>
            <div className="content-title">Assessment </div>
            <form onSubmit={this.assessmentSubmit}>
              <div className="row">
              <div className="form-group col-12 col-sm-6 col-lg-3">
                    <label htmlFor="Assessment">Assessment:</label>
                    <div className="form-select">
                    <select
                    className="form-control"
                      name="Assessment"
                      id="Assessment"
                      onChange={this.onChangeHandler}
                    >
                      {this.state.Assessments.map(assessment => (
                        <option key={assessment.id} value={assessment.id}>
                          {assessment.name}
                        </option>
                      ))}
                    </select>
                    </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
                    <label htmlFor="EffectRation">Effect Ration:</label>
                    <input
                    className="form-control"
                      value={this.state.EffectRation}
                      name="EffectRation"
                      id="EffectRation"
                      onChange={this.onChangeHandler}
                      type="number"
                      max="100.0"
                      step="0.1"
                      required
                    />
              </div>
              <div className="form-group col-12 col-sm-6 col-lg-3">
                  <br/>
                  <Button color="success" type="submit" disabled={this.state.Loading}>
                    {this.state.Loading && (
                      <i className="ri-loader-4-line ri-spin"></i>
                    )}
                    {!this.state.Loading && <span> Add</span>}
                    {this.state.Loading && <span> Wait ...</span>}
                  </Button>
               </div>
                </div>
            </form>

            <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>EffectRation</th>
          
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.EvaluationAssessments.map(e => (
              <tr key={e.id}>
                <td>{this.state.Assessments[this.state.Assessments.findIndex(x => x.id === parseInt(e.assessmentId))].name}</td>
                <td>{e.effectRation}</td>      
                <td>
                  <Button onClick={() => this.deleteEvaluationAssessment(e)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>



          </div>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(AddEvaluation);
