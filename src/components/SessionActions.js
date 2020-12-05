import React, { Component } from "react";
import assesmentIcon from "../images/assessment.svg";
import attendanceAdminIcon from "../images/attendance-admin.svg";
import attendanceSheetIcon from "../images/attendance-sheet.svg";
import dailyAttendanceIcon from "../images/daily-attendance.svg";
import { Popover } from "reactstrap";

export default class SessionActions extends Component {
  state = {};

  closeAll = () =>{
    let newPopovers = this.state;
    Object.keys(newPopovers).map((key) => {
      newPopovers[key] = false;
    });
    this.setState({
      ...newPopovers,
    });
  }
  onHover = (target) => {
    let newPopovers = this.state;
    Object.keys(newPopovers).map((key) => {
      newPopovers[key] = false;
    });
    this.setState({
      ...newPopovers,
      [target]: !this.state[target],
    });
  };
  onHoverLeave = (target) => {
    this.setState({
      [target]: true,
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
      <div className="td action-buttons"
      onMouseLeave={this.closeAll}
      >
        <div
          id={`row${rowId}1`}
          className="p-2"
          onMouseEnter={() => this.onHover(`row${rowId}1`)}
          onMouseLeave={() => this.onHoverLeave(`row${rowId}1`)}
          onClick={clickAssessment}
        >
          <img src={assesmentIcon} alt="assesmentIcon"/>
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
          className="p-2"
          onMouseEnter={() => this.onHover(`row${rowId}2`)}
          onMouseLeave={() => this.onHoverLeave(`row${rowId}2`)}
          onClick={clickDailyAttendance}
        >
          <img src={dailyAttendanceIcon} alt="dailyAttendanceIcon" />
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
          className="p-2"
          onMouseEnter={() => this.onHover(`row${rowId}3`)}
          onMouseLeave={() => this.onHoverLeave(`row${rowId}3`)}
          onClick={clickAttendanceAdmin}
        >
          <img src={attendanceAdminIcon} alt="attendanceAdminIcon"/>
        </div>
        <Popover
          placement="bottom"
          isOpen={this.state[`row${rowId}3`]}
          target={`row${rowId}3`}
        >
          AttendanceAdmin
        </Popover>
        <div
          id={`row${rowId}4`}
          className="p-2"
          onMouseEnter={() => this.onHover(`row${rowId}4`)}
          onMouseLeave={() => this.onHoverLeave(`row${rowId}4`)}
          onClick={clickAttendanceSheet}
        >
          <img src={attendanceSheetIcon} alt="attendanceSheetIcon"/>
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
