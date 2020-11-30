import React, { Component } from 'react'
import history from "../../history";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import * as Config from "../../config";
class TeacherAssignment extends Component {
    async componentDidMount() {
        if (this.props.token) {
          if (history.location.state) {
              console.log(history.location.state.id);
            this.setState({ IsAdd: false });
            let obj = {
                TeacherId:history.location.state.id,
                Date:""
              };
              await axios
                .post(Config.ApiUrl + "api/assignment/getbyteacherassignment", obj)
                .then((response) => {
            console.log(response.data);
                })
                .catch((error) => {
                  alertify.error(error.response.data, 4);
                });
          } else {
          }
        } else {
        }
      }
    render() {
        return (
            <div>
                <div className="content-title">Teacher Assignment</div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return { token: state.authReducer };
  }
  export default connect(mapStateToProps)(TeacherAssignment);