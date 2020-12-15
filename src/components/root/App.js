import React, { Component } from "react";
import Login from "./Login";
import { connect } from "react-redux";
import Layout from "../layout/layout";
import Loading from "../Loading";
class App extends Component {
  render() {
    const isLogin = () => {
      if (this.props.token) {
        return <Layout />;
      } else {
        return <Login />;
      }
    };
    return (
      <div>
        {/* <Loading /> */}
        {isLogin()}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(App);
