import React, { Component } from 'react';
import Login from './Login';
import { connect } from 'react-redux';
import Layout from '../layout/layout';
import Loading from '../Loading';
import { changeTheme } from '../../redux/actions/rootAction';

class App extends Component {
  componentWillMount() {
    if (localStorage.getItem('theme')) {
      let isDarkMode = localStorage.getItem('theme') === 'dark';
      this.props.actions.changeTheme(localStorage.getItem('theme'));

      if (isDarkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }
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

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      changeTheme: (data) => dispatch(changeTheme(data)),
    },
  };
}
function mapStateToProps(state) {
  return { token: state.authReducer, theme: state.rootReducer.theme };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
