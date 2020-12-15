import React, { Component } from "react";
import Table from "../Table";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import * as Config from "../../config";
class EvaluationSearch extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  state = {
    url: Config.ApiUrl + "api/evaluation/getsearch",
    searchObj: { SearchWord: "" },
    editurl: "/AddEvaluation",
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
  onChangeHandler = event => {
    let obj = { SearchWord: event.target.value };
    this.setState({ searchObj: obj });
  };
  onSubmitHandler = async event => {
    event.preventDefault();
    this.setState({ Loading: true });
    this.child.current.componentDidMount();
    this.setState({ Loading: false });
  };
  async componentDidMount() {
    // if (this.props.token) {
    // } else {
    // }
  }
  render() {
    return (
      <div>
        <div className="content-title">Evaluation Search</div>
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
              <label htmlFor="Status">Status:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  name="Status"
                  id="Status"
                  onChange={this.onActiveHandler}
                  value={this.state.status}
                >
                  <option value={true}> Active </option>
                  <option value={false}> Pasive </option>
                </select>
              </div>
            </div>

            <div className="form-group col-12 col-sm-6 col-lg-3">
              <Button
                type="submit"
                color="primary"
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
export default connect(mapStateToProps)(EvaluationSearch);
