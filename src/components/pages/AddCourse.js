import React, { Component } from 'react';
import { Button } from 'reactstrap';
import history from '../../history';
import axios from 'axios';
import alertify from 'alertifyjs';
import { connect } from 'react-redux';
import S3FileUpload from 'react-s3';
import * as Config from '../../config';
class AddCourse extends Component {
  onActiveHandler = (event) => {
    switch (event.target.value) {
      case 'true':
        this.setState({ Status: true });
        break;

      default:
        this.setState({ Status: false });
        break;
    }
  };

  state = {
    Id: 0,
    CourseName: '',
    Level: '',
    Status: true,
    BranchId: '',
    Description: '',
    DaysInWeek: '1',
    Goal: '',
    Objectives: '',
    Topic: '',
    Vocabulary: '',
    Grammar: '',
    Writing: '',
    Speaking: '',
    EndOfModuleWriting: '',
    EndOfModuleSpeaking: '',
    ProgressQuizzes: '',
    EndOfModuleExamReading: '',
    EndOfModuleExamUOE: '',
    EndOfModuleExamVocabulary: '',
    EndOfModuleExamListening: '',
    FileTypeId: '',
    Loading: false,
    IsAdd: true,
    Name: '',
    Title: '',
    Types: [],
    File: '',
    FileList: [],
    DeletedCount: 0,
  };
  getFileTypeName(type) {
    return this.state.Types[parseInt(type - 1)].name;
  }
  AddFile() {
    if (this.state.Name !== '' && this.state.File !== '') {
      let Files = this.state.FileList;
      let obj = {
        Id: Files.length + 1 + parseInt(this.state.DeletedCount),
        Name: this.state.Name,
        Title: this.state.Title,
        FileTypeId: parseInt(this.state.FileTypeId),
        File: this.state.File,
        S3Location: '',
        ReelId: '',
      };
      Files.push(obj);
      this.setState({ FileList: Files });
    } else {
      alertify.error('Fill in the required fields', 4);
    }
  }
  async fileDelete(file) {
    if (!this.state.Loading) {
      this.setState({ Loading: true });
      var count = parseInt(this.state.DeletedCount);
      count++;
      this.setState({ DeletedCount: count });
      var list = this.state.FileList;
      if (file.S3Location === '') {
      } else {
        var status = false;
        var name = file.S3Location.substring(
          file.S3Location.indexOf('CourseFile/') + 11,
          file.S3Location.length
        );
        await S3FileUpload.deleteFile(name, Config.S3CourseFileconfig)
          .then((response) => {
            status = true;
          })
          .catch((err) => console.error(err));
        if (status === true) {
          var courseFile = {
            Id: file.ReelId,
            Name: file.Name,
            Title: file.Title,
          };

          await axios
            .post(Config.ApiUrl + 'api/coursefile/delete', courseFile)
            .then((response) => {
              alertify.success(response.data, 4);
            })
            .catch((error) => {
              alertify.error(error.response.data, 4);
            });
        }
      }
      list.splice(this.state.FileList.indexOf(file), 1);
      this.setState({ FileList: list });
      this.setState({ Loading: false });
    }
  }
  handleFile = (e) => {
    var blob = e.target.files[0].slice(0, e.target.files[0].size);
    var type = e.target.files[0].type;
    var extension = e.target.files[0].name.substring(
      e.target.files[0].name.indexOf('.'),
      e.target.files[0].name.length
    );
    var newFile = new File(
      [blob],
      e.target.files[0].name.substring(0, e.target.files[0].name.indexOf('.')) +
        Date.now() +
        extension,
      { type: type }
    );
    this.setState({ File: newFile });
  };
  async componentDidMount() {
    if (this.props.token) {
      await axios
        .get(Config.ApiUrl + 'api/coursefiletype/getall')
        .then((c) => {
          this.setState({ Types: c.data });
          this.setState({ FileTypeId: c.data[0].id });
        })
        .catch((error) => {
          console.log(error.response);
        });
      this.setState({ IsAdd: true });
      this.setState({ BranchId: this.props.user.userBranches[0].id });
      if (history.location.state) {
        this.setState({ IsAdd: false });
        await axios
          .get(
            Config.ApiUrl +
              'api/course/getbyid?courseid=' +
              history.location.state.id
          )
          .then((r) => {
            this.setState({ CourseName: r.data.courseName });
            this.setState({ Level: r.data.level });
            this.setState({ BranchId: r.data.branchId });
            this.setState({ Id: r.data.id });
            this.setState({ Status: r.data.status });

            this.setState({ Description: r.data.description });
            this.setState({ DaysInWeek: r.data.daysInWeek });
            this.setState({ Goal: r.data.goal });
            this.setState({ Objectives: r.data.objectives });
            this.setState({ Topic: r.data.topic });

            this.setState({ Vocabulary: r.data.vocabulary });
            this.setState({ Grammar: r.data.grammar });
            this.setState({ Writing: r.data.writing });
            this.setState({ Speaking: r.data.speaking });
            this.setState({ EndOfModuleWriting: r.data.endOfModuleWriting });

            this.setState({ EndOfModuleSpeaking: r.data.endOfModuleSpeaking });
            this.setState({ ProgressQuizzes: r.data.progressQuizzes });
            this.setState({ EndOfModuleExamUOE: r.data.endOfModuleExamUOE });

            this.setState({
              EndOfModuleExamReading: r.data.endOfModuleExamReading,
            });
            this.setState({
              EndOfModuleExamVocabulary: r.data.endOfModuleExamVocabulary,
            });
            this.setState({
              EndOfModuleExamListening: r.data.endOfModuleExamListening,
            });
          })
          .catch((error) => {
            console.log(error.response);
          });
        var AddedList = [];
        await axios
          .get(
            Config.ApiUrl +
              'api/coursefile/getbycourseid?courseid=' +
              history.location.state.id
          )
          .then((r) => {
            AddedList = r.data;
          })
          .catch((error) => {
            console.log(error.response);
          });
        let AddedFiles = [];
        for (let index = 0; index < AddedList.length; index++) {
          var addobj = {
            Id: index,
            Name: AddedList[index].name,
            Title: AddedList[index].title,
            FileTypeId: AddedList[index].courseFileTypeId,
            S3Location: AddedList[index].locationUrl,
            File: '',
            ReelId: AddedList[index].id,
          };
          AddedFiles.push(addobj);
        }
        this.setState({ FileList: AddedFiles });
      } else {
      }
    } else {
    }
  }
  onSubmitHandler = async (event) => {
    event.preventDefault();
    this.setState({ Loading: true });
    let obj = {
      Id: parseInt(this.state.Id),
      BranchId: parseInt(this.state.BranchId),
      CourseName: this.state.CourseName,
      Level: this.state.Level,
      Status: this.state.Status,
      Description: this.state.Description,
      DaysInWeek: parseInt(this.state.DaysInWeek),
      Goal: this.state.Goal,
      Objectives: this.state.Objectives,
      Topic: this.state.Topic,
      Vocabulary: this.state.Vocabulary,
      Grammar: this.state.Grammar,
      Writing: this.state.Writing,
      Speaking: this.state.Speaking,
      EndOfModuleWriting: this.state.EndOfModuleWriting,
      EndOfModuleSpeaking: this.state.EndOfModuleSpeaking,
      ProgressQuizzes: this.state.ProgressQuizzes,
      EndOfModuleExamReading: this.state.EndOfModuleExamReading,
      EndOfModuleExamUOE: this.state.EndOfModuleExamUOE,
      EndOfModuleExamVocabulary: this.state.EndOfModuleExamVocabulary,
      EndOfModuleExamListening: this.state.EndOfModuleExamListening,
    };
    var addedid = 0;

    await axios
      .post(Config.ApiUrl + 'api/course/add', obj)
      .then((response) => {
        if (this.state.IsAdd === true) {
          addedid = response.data.data.id;
        } else {
          addedid = this.state.Id;
        }

        alertify.success(response.data.message, 4);
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });

    if (addedid !== 0) {
      var courseFiles = [];
      for (let index = 0; index < this.state.FileList.length; index++) {
        if (this.state.FileList[index].S3Location === '') {
          await S3FileUpload.uploadFile(this.state.FileList[index].File, Config.S3CourseFileconfig)
            .then((data) => {
              var obj = {
                Name: this.state.FileList[index].Name,
                Title: this.state.FileList[index].Title,
                LocationUrl: data.location,
                CourseFileTypeId: parseInt(
                  this.state.FileList[index].FileTypeId
                ),
              };
              courseFiles.push(obj);
            })
            .catch((err) => console.error(err));
        }
      }
      var courseFile = {
        CourseFiles: courseFiles,
        CourseId: addedid,
      };

      await axios
        .post(Config.ApiUrl + 'api/coursefile/add', courseFile)
        .then((response) => {})
        .catch((error) => {
          alertify.error(error.response.data, 4);
        });
    }
    this.setState({ Loading: false });
    history.push('/CourseSearch');
  };
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <div>
        {this.state.IsAdd && <div className="content-title">Add Course</div>}
        {!this.state.IsAdd && (
          <div className="content-title"> Update Course</div>
        )}

        <form onSubmit={this.onSubmitHandler}>
          <div className="row">
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="CourseName">Course Name:</label>
              <input
                className="form-control"
                value={this.state.CourseName}
                name="CourseName"
                id="CourseName"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Level">Level:</label>
              <input
                className="form-control"
                value={this.state.Level}
                name="Level"
                id="Level"
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
                    {this.props.user.userBranches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="DaysInWeek">DaysInWeek:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  name="DaysInWeek"
                  id="DaysInWeek"
                  onChange={this.onChangeHandler}
                  value={this.state.DaysInWeek}
                >
                  <option value="1"> 1 Days </option>
                  <option value="2"> 2 Days </option>
                  <option value="3"> 3 Days </option>
                  <option value="4"> 4 Days </option>
                  <option value="5"> 5 Days </option>
                </select>
              </div>
            </div>
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

            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Goal">Goal:</label>
              <textarea
                className="form-control"
                value={this.state.Goal}
                name="Goal"
                id="Goal"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Objectives">Objectives:</label>
              <textarea
                className="form-control"
                value={this.state.Objectives}
                name="Objectives"
                id="Objectives"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Topic">Topic:</label>
              <textarea
                className="form-control"
                value={this.state.Topic}
                name="Topic"
                id="Topic"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Vocabulary">Vocabulary:</label>
              <textarea
                className="form-control"
                value={this.state.Vocabulary}
                name="Vocabulary"
                id="Vocabulary"
                onChange={this.onChangeHandler}
                required
              />
            </div>

            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Grammar">Grammar:</label>
              <textarea
                className="form-control"
                value={this.state.Grammar}
                name="Grammar"
                id="Grammar"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Writing">Writing:</label>
              <textarea
                className="form-control"
                value={this.state.Writing}
                name="Writing"
                id="Writing"
                onChange={this.onChangeHandler}
                required
              />
            </div>

            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Speaking">Speaking:</label>
              <textarea
                className="form-control"
                value={this.state.Speaking}
                name="Speaking"
                id="Speaking"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="EndOfModuleWriting">End Of Module Writing:</label>
              <textarea
                className="form-control"
                value={this.state.EndOfModuleWriting}
                name="EndOfModuleWriting"
                id="EndOfModuleWriting"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="EndOfModuleSpeaking">
                End Of Module Speaking:
              </label>
              <textarea
                className="form-control"
                value={this.state.EndOfModuleSpeaking}
                name="EndOfModuleSpeaking"
                id="EndOfModuleSpeaking"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="ProgressQuizzes">ProgressQuizzes:</label>
              <textarea
                className="form-control"
                value={this.state.ProgressQuizzes}
                name="ProgressQuizzes"
                id="ProgressQuizzes"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="EndOfModuleExamReading">
                End Of Module ExamReading:
              </label>
              <textarea
                className="form-control"
                value={this.state.EndOfModuleExamReading}
                name="EndOfModuleExamReading"
                id="EndOfModuleExamReading"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="EndOfModuleExamUOE">End Of Module ExamUOE:</label>
              <textarea
                className="form-control"
                value={this.state.EndOfModuleExamUOE}
                name="EndOfModuleExamUOE"
                id="EndOfModuleExamUOE"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="EndOfModuleExamVocabulary">
                End Of Module Exam Vocabulary:
              </label>
              <textarea
                className="form-control"
                value={this.state.EndOfModuleExamVocabulary}
                name="EndOfModuleExamVocabulary"
                id="EndOfModuleExamVocabulary"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="EndOfModuleExamListening">
                End Of Module Exam Listening:
              </label>
              <textarea
                className="form-control"
                value={this.state.EndOfModuleExamListening}
                name="EndOfModuleExamListening"
                id="EndOfModuleExamListening"
                onChange={this.onChangeHandler}
                required
              />
            </div>
          </div>

          <div className="content-title mt-5">Upload Files</div>
          <div className="row">
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Name">Name:</label>
              <input
                className="form-control"
                value={this.state.Name}
                name="Name"
                id="Name"
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Name">Title:</label>
              <input
                className="form-control"
                value={this.state.Title}
                name="Title"
                id="Title"
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-2">
              <label htmlFor="FileTypeId">FileType:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  type="select"
                  name="FileTypeId"
                  id="FileTypeId"
                  value={this.state.FileTypeId}
                  onChange={this.onChangeHandler}
                >
                  {this.state.Types.map((filetype) => (
                    <option key={filetype.id} value={filetype.id}>
                      {filetype.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-2">
              <label>File:</label>
              <input type="file" onChange={this.handleFile} />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-2 d-flex">
              <Button
                disabled={this.state.Loading}
                type="button"
                className="btn btn-primary align-self-end"
                onClick={() => this.AddFile()}
              >
                {this.state.Loading && (
                  <i className="ri-loader-4-line ri-spin"></i>
                )}
                {!this.state.Loading && 'Add File'}
                {this.state.Loading && <span> Wait ...</span>}
              </Button>
            </div>
          </div>
          <div className="table-wrapper">
            <div className="table reponsive-table">
              <div className="ttop">
                <div className="thead">
                  <div className="tr">
                    <div className="td">Name</div>
                    <div className="td">Title</div>
                    <div className="td">FileType</div>
                    <div className="td">Option</div>
                  </div>
                </div>
                <div className="tbody">
                  {this.state.FileList.map((file) => (
                    <div className="tr" key={file.Id}>
                      {file.S3Location === '' ? (
                        <div className="td">{file.Name}</div>
                      ) : (
                        <div className="td">
                          <a href={file.S3Location} target="blank">
                            {file.Name}
                          </a>
                        </div>
                      )}
                      <div className="td">{file.Title}</div>
                      <div className="td">
                        {this.getFileTypeName(file.FileTypeId)}
                      </div>
                      <div className="td">
                        <div
                          className="btn p-0 text-danger"
                          onClick={() => this.fileDelete(file)}
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            color="success mt-20"
            disabled={this.state.Loading}
          >
            {this.state.Loading && <i className="ri-loader-4-line ri-spin"></i>}
            {!this.state.Loading && (
              <span>{this.state.IsAdd === true ? 'Add' : 'Update'}</span>
            )}
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
export default connect(mapStateToProps)(AddCourse);
