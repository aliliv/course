import React, { Component } from "react";
import { Popover } from "reactstrap";
export default class SessionActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
  }
  closeAll = () => {
    let newPopovers = this.state;
    Object.keys(newPopovers).forEach((key) => {
      newPopovers[key] = false;
    });
    this.setState({
      ...newPopovers,
    });
  };
  onHover = (target) => {
    let newPopovers = this.state;
    Object.keys(newPopovers).forEach((key) => {
      newPopovers[key] = false;
    });
    this.setState({
      ...newPopovers,
      [target]: !this.state[target],
    });
  };
  onHoverLeave = (target) => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  render() {
    let {
      rowId,
      clickAssessment,
      clickDailyAttendance,
      clickAttendanceAdmin,
      clickAttendanceSheet,
    } = this.props;

    return (
      <div className="td action-buttons" onMouseLeave={this.closeAll}>
        <div
          id={`row${rowId}1`}
          className="p-1 action-button"
          onMouseEnter={() => this.onHover(`row${rowId}1`)}
          onMouseLeave={() => this.onHoverLeave(`row${rowId}1`)}
          onClick={clickAssessment}
        >
          <i className="ri-calculator-line"></i>
        </div>
        <Popover
          placement="bottom"
          isOpen={this.state[`row${rowId}1`]}
          target={`row${rowId}1`}
        >
          Assessment
        </Popover>
        <div
          id={`row${rowId}2`}
          className="p-1 action-button"
          onMouseEnter={() => this.onHover(`row${rowId}2`)}
          onMouseLeave={() => this.onHoverLeave(`row${rowId}2`)}
          onClick={clickDailyAttendance}
        >
          <i className="ri-calendar-check-line"></i>
        </div>
        <Popover
          placement="bottom"
          isOpen={this.state[`row${rowId}2`]}
          target={`row${rowId}2`}
        >
          Daily Attendance
        </Popover>
        <div
          id={`row${rowId}3`}
          className="p-1 action-button"
          onMouseEnter={() => this.onHover(`row${rowId}3`)}
          onMouseLeave={() => this.onHoverLeave(`row${rowId}3`)}
          onClick={clickAttendanceAdmin}
        >
          <i className="ri-account-box-line"></i>
        </div>
        <Popover
          placement="bottom"
          isOpen={this.state[`row${rowId}3`]}
          target={`row${rowId}3`}
        >
          Attendance Admin
        </Popover>
        <div
          id={`row${rowId}4`}
          className="p-1 action-button"
          onMouseEnter={() => this.onHover(`row${rowId}4`)}
          onMouseLeave={() => this.onHoverLeave(`row${rowId}4`)}
          onClick={clickAttendanceSheet}
        >
          <i className="ri-file-list-2-line"></i>
        </div>
        <Popover
          placement="bottom"
          isOpen={this.state[`row${rowId}4`]}
          target={`row${rowId}4`}
        >
          Attendance Sheet
        </Popover>
      </div>
    );
  }
}
