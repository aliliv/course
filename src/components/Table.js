import React, { Component } from "react";
import axios from "axios";
import history from "../history";
import SessionActions from "./SessionActions"


export default class Table extends Component {
  state = {
    tableView: [],
    totalCount: "",
    maxPage: "",
    Page: 1,
    PageSize: 5,
    titles: [],
  };


  pageChange(id) {
    history.push({
      pathname: this.props.searchobj.editurl,
      search: "",
      state: { id: id },
    });
  }
  Go(id, pagename) {
    if (pagename === "Assessment") {
      history.push({
        pathname: "/StudentAssessment",
        search: "",
        state: { id: id },
      });
    } else if (pagename === "DailyAttendance") {
      history.push({
        pathname: "/DailyAttendance",
        search: "",
        state: { id: id },
      });
    } else if (pagename === "AttendanceAdmin") {
      history.push({
        pathname: "/AttendanceAdmin",
        search: "",
        state: { id: id },
      });
    } else if (pagename === "AttendanceSheet") {
      history.push({
        pathname: "/AttendanceSheet",
        search: "",
        state: { id: id },
      });
    } else if (pagename === "TeacherAssignment") {
      history.push({
        pathname: "/TeacherAssignment",
        search: "",
        state: { id: id },
      });
    }
  }

  async SendSearch(searchobj) {
    await axios
      .post(this.props.searchobj.url, searchobj)
      .then((response) => {
        this.setState({ tableView: response.data.tableView });
        this.setState({ totalCount: response.data.totalCount });
        this.setState({ maxPage: response.data.maxPage });
        this.setState({ titles: Object.keys(response.data.tableView[0]) });
      })
      .catch((error) => {});
  }
  async componentDidMount() {
    let searchobj = {
      SearchObj: this.props.searchobj.searchObj,
      Status: this.props.searchobj.status,
      Page: this.state.Page,
      PageSize: parseInt(this.state.PageSize),
      UserId: this.props.userid,
    };
    this.SendSearch(searchobj);
  }
  pageSizeChangeHandler = (event) => {
    let value = event.target.value;
    this.setState({ PageSize: value });
    this.setState({ Page: 1 });
    let searchobj = {
      SearchObj: this.props.searchobj.searchObj,
      Status: this.props.searchobj.status,
      Page: 1,
      PageSize: parseInt(value),
      UserId: this.props.userid,
    };
    this.SendSearch(searchobj);
  };
  FirstPage = async (event) => {
    this.setState({ Page: 1 });
    let searchobj = {
      SearchObj: this.props.searchobj.searchObj,
      Status: this.props.searchobj.status,
      Page: 1,
      PageSize: parseInt(this.state.PageSize),
      UserId: this.props.userid,
    };
    this.SendSearch(searchobj);
    //event.target.parentElement.parentElement.classList.add("passive");
  };
  LastPage = async (event) => {
    let page = parseInt(this.state.maxPage);
    this.setState({ Page: page });
    let searchobj = {
      SearchObj: this.props.searchobj.searchObj,
      Status: this.props.searchobj.status,
      Page: page,
      PageSize: parseInt(this.state.PageSize),
      UserId: this.props.userid,
    };
    this.SendSearch(searchobj);
    //event.target.parentElement.parentElement.classList.add("passive");
  };
  NextPage = async (event) => {
    let maxpage = parseInt(this.state.maxPage);
    let page = parseInt(this.state.Page);
    if (maxpage > page) {
      page++;
      this.setState({ Page: page });
      let searchobj = {
        SearchObj: this.props.searchobj.searchObj,
        Status: this.props.searchobj.status,
        Page: page,
        PageSize: parseInt(this.state.PageSize),
        UserId: this.props.userid,
      };
      this.SendSearch(searchobj);
      // if (maxpage == page) {
      //   event.target.parentElement.parentElement.classList.add("passive");
      // }
    }
  };
  PrevPage = async (event) => {
    let page = parseInt(this.state.Page);
    if (page > 1) {
      page--;
      this.setState({ Page: page });
      let searchobj = {
        SearchObj: this.props.searchobj.searchObj,
        Status: this.props.searchobj.status,
        Page: page,
        PageSize: parseInt(this.state.PageSize),
        UserId: this.props.userid,
      };
      this.SendSearch(searchobj);
      // if (maxpage == page) {
      //   event.target.parentElement.parentElement.classList.add("passive");
      // }
    }
  };

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <div className="table-wrapper">
              <div className="table table-responsive">
                <div className="ttop">
                  <div className="thead">
                    <div className="tr">
                      {this.state.titles.map((val) => (
                        <div className="td" key={val}>
                          {val}
                        </div>
                      ))}
                      <div className="td"> </div>
                      {this.props.searchobj.editurl === "/AddSession" ||
                      this.props.searchobj.editurl === "/AddTeacher" ? (
                        <div className="td"></div>
                      ) : null}
                    </div>
                  </div>
                  <div className="tbody">
                    {this.state.tableView.map((c) => (
                      <div className="tr" key={c.id}>
                        {this.state.titles.map((val) => (
                          <div className="td" key={c.id + val}>
                            {c[val].toString()}
                          </div>
                        ))}

                        {this.props.searchobj.editurl === "/AddSession" ? (
                          <SessionActions
                          rowId={c.id}
                          clickAssessment= {() => this.Go(c.id, "Assessment")}
                          clickDailyAttendance= {() => this.Go(c.id, "DailyAttendance")}
                          clickAttendanceAdmin= {() => this.Go(c.id, "AttendanceAdmin")}
                          clickAttendanceSheet= {() => this.Go(c.id, "AttendanceSheet")}
                          />
                        ) : null}
                        {this.props.searchobj.editurl === "/AddTeacher" ? (
                          <div className="td">
                            <div
                              className="btn btn-info"
                              onClick={() => this.Go(c.id, "TeacherAssignment")}
                            >
                              Assigment
                            </div>
                          </div>
                        ) : null}
                        <div className="td">
                          <a
                            className="btn"
                            onClick={() => this.pageChange(c.id)}
                          >
                            Edit
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-12 col-md-6">
                  <div className="pagination-select">
                    <label htmlFor="pagination-select">Rows Per Page:</label>

                    <div className="form-select">
                      <select
                        id="pagination-select"
                        className="form-control"
                        name="PageSize"
                        onChange={this.pageSizeChangeHandler}
                        value={this.state.PageSize}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="25">25</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center justify-content-md-end align-items-center">
                      <li className="page-item">
                        <div
                          className="page-link first"
                          onClick={this.FirstPage}
                        >
                          <span></span>
                        </div>
                      </li>
                      {/* <li className="page-item passive"> */}
                      <li className="page-item">
                        <div className="page-link prev" onClick={this.PrevPage}>
                          <span></span>
                        </div>
                      </li>
                      <li className="page-item count">
                        <div className="page-link" href="#">
                          {this.state.Page} of {this.state.maxPage}
                        </div>
                      </li>

                      <li className="page-item">
                        <div className="page-link next" onClick={this.NextPage}>
                          <span></span>
                        </div>
                      </li>
                      <li className="page-item">
                        <div className="page-link last" onClick={this.LastPage}>
                          <span></span>
                        </div>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
