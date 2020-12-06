import React, { Component } from "react";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

export default class SessionActions extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }
  // onHover = (target) => {
  //   let newPopovers = this.state;
  //   Object.keys(newPopovers).map((key) => {
  //     newPopovers[key] = false;
  //   });
  //   this.setState({
  //     ...newPopovers,
  //     [target]: !this.state[target],
  //   });
  // };
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  render() {
    let {
      rowId,
      clickAssessment,
      clickDailyAttendance,
      clickAttendanceAdmin,
      clickAttendanceSheet,
    } = this.props;

    return (
      <div id={`dropdown-${rowId}`} className="action-buttons">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle>
          <i className="fas fa-ellipsis-h"></i>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={clickAssessment}>Assesment</DropdownItem>
            <DropdownItem onClick={clickDailyAttendance}>
              Daily Attendance
            </DropdownItem>
            <DropdownItem onClick={clickAttendanceAdmin}>
              Attendance Admin
            </DropdownItem>
            <DropdownItem onClick={clickAttendanceSheet}>
              Attendance Sheet
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}
