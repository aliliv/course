import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Router, Route } from "react-router-dom";
import axios from "axios";
import history from "../../history";
import { bindActionCreators } from "redux";
import { logaut } from "../../redux/actions/authAction";
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";
import "../../../src/App.css";
// import avatar from "../../images/avatar.png";
import Main from "../pages/Main";
import NewUser from "../pages/NewUser";
import Groups from "../pages/Groups";
import UserSearch from "../pages/UserSearch";
import AddClassroom from "../pages/AddClassroom";
import AddCourse from "../pages/AddCourse";
import AddSession from "../pages/AddSession";
import ClassroomSearch from "../pages/ClassroomSearch";
import CourseSearch from "../pages/CourseSearch";
import AddEvaluation from "../pages/AddEvaluation";
import EvaluationSearch from "../pages/EvaluationSearch";
import SessionSearch from "../pages/SessionSearch";
import AgencySearch from "../pages/AgencySearch";
import AddAgency from "../pages/AddAgency";
import StudentSearch from "../pages/StudentSearch";
import TeacherSearch from "../pages/TeacherSearch";
import AssignmentSearch from "../pages/AssignmentSearch";
import AddStudent from "../pages/AddStudent";
import AddTeacher from "../pages/AddTeacher";
import NewAssignment from "../pages/NewAssignment";
import StudentAssessment from "../pages/StudentAssessment";
import DailyAttendance from "../pages/DailyAttendance";
import AttendanceAdmin from "../pages/AttendanceAdmin";
import AttendanceSheet from "../pages/AttendanceSheet";
import AddPaymentType from "../pages/AddPaymentType";
import PaymentTypeSearch from "../pages/PaymentTypeSearch";
import TeacherAssignment from "../pages/TeacherAssignment";
import AddBuilding from "../pages/AddBuilding";
import BuildingSearch from "../pages/BuildingSearch";
import BuildingReport from "../pages/BuildingReport";
import Switch from "../../components/Switch";
import * as Config from "../../config";

import Logo from "../../images/mentora-toronto-logo.svg";
import { changeTheme } from "../../redux/actions/rootAction";
class layout extends Component {
  state = {
    operationClaims: [],
    user: {},
    isOpen: false,
    setIsOpen: false,
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.theme !== nextProps.theme) {
      return false;
    }

    return true;
  }
  async componentDidMount() {
    if (this.props.token) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.props.token}`;
      await axios
        .get(
          Config.ApiUrl +
            "api/users/getbyuseremail?email=" +
            jwtDecode(this.props.token).email
        )
        .then((r) => {
          this.setState({ user: r.data });
          this.setState({ operationClaims: r.data.operationClaims });
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
    }
  }
  onClick = (event) => {
    sessionStorage.removeItem("Token");
    this.props.actions.logaut();
  };
  pageChange(page) {
    history.push("/" + page);
  }

  toggleSwitch = (value) => {
    let valueToStore = value ? "light" : "dark";
    this.props.actions.changeTheme(valueToStore);

    if (!value) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  returncomponent(componentname) {
    switch (componentname) {
      case "UserSearch":
        return <UserSearch user={this.state.user} />;
      case "NewUser":
        return <NewUser user={this.state.user} />;
      case "Groups":
        return <Groups user={this.state.user} />;
      case "AddClassroom":
        return <AddClassroom user={this.state.user} />;
      case "ClassroomSearch":
        return <ClassroomSearch user={this.state.user} />;
      case "AddCourse":
        return <AddCourse user={this.state.user} />;
      case "CourseSearch":
        return <CourseSearch user={this.state.user} />;
      case "AddEvaluation":
        return <AddEvaluation user={this.state.user} />;
      case "EvaluationSearch":
        return <EvaluationSearch user={this.state.user} />;
      case "AddSession":
        return <AddSession user={this.state.user} />;
      case "SessionSearch":
        return <SessionSearch user={this.state.user} />;
      case "AgencySearch":
        return <AgencySearch user={this.state.user} />;
      case "AddAgency":
        return <AddAgency user={this.state.user} />;
      case "StudentSearch":
        return <StudentSearch user={this.state.user} />;
      case "AddStudent":
        return <AddStudent user={this.state.user} />;
      case "TeacherSearch":
        return <TeacherSearch user={this.state.user} />;
      case "AddTeacher":
        return <AddTeacher user={this.state.user} />;
      case "NewAssignment":
        return <NewAssignment user={this.state.user} />;
      case "AssignmentSearch":
        return <AssignmentSearch user={this.state.user} />;
      case "StudentAssessment":
        return <StudentAssessment user={this.state.user} />;
      case "DailyAttendance":
        return <DailyAttendance user={this.state.user} />;
      case "AttendanceAdmin":
        return <AttendanceAdmin user={this.state.user} />;
      case "AttendanceSheet":
        return <AttendanceSheet user={this.state.user} />;
      case "AddPaymentType":
        return <AddPaymentType user={this.state.user} />;
      case "PaymentTypeSearch":
        return <PaymentTypeSearch user={this.state.user} />;
      case "TeacherAssignment":
        return <TeacherAssignment user={this.state.user} />;
      case "AddBuilding":
        return <AddBuilding user={this.state.user} />;
      case "BuildingSearch":
        return <BuildingSearch user={this.state.user} />;
        case "BuildingReport":
          return <BuildingReport user={this.state.user} />;
      default:
        break;
    }
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }
  render() {
    return (
      <div>
        <header>
          <div className="container">
            <Navbar className="navbar navbar-light navbar-expand-xl col-12">
              <NavbarBrand>
                {" "}
                <img className="profile-img" src={Logo} alt="" />
              </NavbarBrand>
              <NavbarToggler onClick={() => this.toggle()} />
              <Collapse
                isOpen={this.state.isOpen}
                className="collapse navbar-collapse"
              >
                <Nav className="navbar-nav m-auto mt-2">
                  {this.state.operationClaims.map((menuitem) =>
                    menuitem.parentId === null ? (
                      <UncontrolledDropdown
                        className="nav-item position-static dropdown"
                        nav
                        inNavbar
                        key={menuitem.id}
                      >
                        <DropdownToggle
                          className="nav-link dropdown-toggle"
                          nav
                          caret
                        >
                          {menuitem.name}
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu w-100">
                          <div className="row">
                            {this.state.operationClaims.map((child) =>
                              child.visibility === true &&
                              child.parentId === menuitem.id ? (
                                <div
                                  className="col-12 col-md-6 col-lg-3 dropdown-col"
                                  key={child.id}
                                >
                                  <DropdownItem
                                    onClick={() =>
                                      this.pageChange(
                                        child.name.replace(" ", "")
                                      )
                                    }
                                  >
                                    {child.name}
                                  </DropdownItem>
                                </div>
                              ) : null
                            )}
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    ) : null
                  )}
                </Nav>
                <div className="nav-item position-static dropdown profile-item">
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle
                      id="profile-menu"
                      className="nav-link dropdown-toggle p-0"
                      nav
                      caret
                    >
                      <img
                        className="profile-img d-none d-xl-inline-block"
                        src={this.state.user.imageName}
                        alt=""
                      />
                      <span className="profile-name d-inline d-xl-none"></span>
                    </DropdownToggle>
                    <DropdownMenu right>
                      {/* <DropdownItem className="dropdown-item">
                        Profile
                      </DropdownItem>
                      <DropdownItem className="dropdown-item">
                        Settings
                      </DropdownItem> */}
                      <div className="dropdown-item">
                        <div className="switch-container">
                          <span className="switch-text">Dark Mode</span>
                          <Switch
                            toggleSwitch={(value) => this.toggleSwitch(value)}
                            value={this.props.theme === "dark"}
                          />
                        </div>
                      </div>

                      <DropdownItem
                        className="dropdown-item logout"
                        onClick={() => this.onClick()}
                      >
                        Logout
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </Collapse>
            </Navbar>
          </div>
        </header>
        <div className="page-content">
          <div className="main">
            <div className="container">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item active">
                    <span>Home</span>
                  </li>
                  <li className="breadcrumb-item">
                    {/* <span>{history.location.pathname.replace("/", "")}</span> */}
                  </li>
                </ol>
              </nav>

              <Router history={history}>
                <Route exact path="/" component={Main} />
                {this.state.operationClaims.map((r) =>
                  r.parentId !== null ? (
                    <Route
                      component={() =>
                        this.returncomponent(r.name.replace(" ", ""))
                      }
                      key={r.id}
                      exact
                      path={"/" + r.name.replace(" ", "")}
                    />
                  ) : null
                )}
              </Router>
            </div>
          </div>
        </div>

        <footer>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12">
                <div className="copyright">
                  © Course System 2020 • All Rights reserved.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      logaut: bindActionCreators(logaut, dispatch),
      changeTheme: (data) => dispatch(changeTheme(data)),
    },
  };
}
function mapStateToProps(state) {
  return { token: state.authReducer, theme: state.rootReducer.theme };
}
export default connect(mapStateToProps, mapDispatchToProps)(layout);
