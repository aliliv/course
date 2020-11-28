import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import Table from "../Table";
import * as Config from "../../config";
class CourseSearch extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  };
  state = {
    url: Config.ApiUrl + "api/course/getsearch",
    searchObj: { SearchWord: "",DaysInWeek: 0, },
    editurl: "/AddCourse",
    status: true,
    Loading: false
  };
  onActiveHandler = event => {
    switch (event.target.value) {
      case "true":
        this.setState({ status: true });
        break;

      default:
        this.setState({ status: false });
        break;
    }
  };

  onDayChangeHandler = event => {
    let value = event.target.value;
    let obj={ SearchWord: this.state.searchObj.SearchWord,DaysInWeek: parseInt(value), };
    this.setState({ searchObj: obj });
  };
  onChangeHandler = event => {
    let value = event.target.value;
    let obj={ SearchWord: value,DaysInWeek: parseInt(this.state.searchObj.DaysInWeek), };
    this.setState({ searchObj: obj });
  };
  onSubmitHandler = async event => {
    event.preventDefault();
    this.setState({ Loading: true });
    this.child.current.componentDidMount();
    this.setState({ Loading: false });
  };
 
  render() {
    return (
      <div>
        <h1 className="content-title">Course Search</h1>
        <form onSubmit={this.onSubmitHandler}>
          <div className="row align-items-end">
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="SearchWord">Search Word:</label>
              <input
                className="form-control"
                name="SearchWord"
                id="SearchWord"
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="DaysInWeek">DaysInWeek:</label>
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
        <Table
          searchobj={this.state}
          userid={this.props.user.id}
          ref={this.child}
        />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(CourseSearch);
