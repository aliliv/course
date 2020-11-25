import React, { Component } from "react";
import alertify from "alertifyjs";
import Image from "../../images/mentora-toronto-logo.svg"
import axios from "axios"
import { bindActionCreators } from "redux";
import { login } from "../../redux/actions/authAction";
import {connect} from "react-redux"
import "../../../src/App.css";
import * as Config from "../../config";


 class Login extends Component {
    state={email:'',password:''}
    onChangeHandler=(event)=>{
        let name=event.target.name;
        let  value=event.target.value;
        this.setState({[name]:value})
    }
    onSubmitHandler=async (event)=>{
        event.preventDefault();
        await axios.post(Config.ApiUrl + "api/auth/login",this.state).then(response => { 
          sessionStorage.setItem('Token',response.data.token);
          this.props.dispatch(login());   
        
         // axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
         // axios.defaults.headers.common['Authorization'] =  `Bearer ${response.data.token}`;
        })
        .catch(error => {
             alertify.error(error.response.data, 4);
        });
        
    }
  render() {
    return (


      <div className="container">
      <div className="login-container m-auto">
        <img className="logo" src={Image} alt="" />

        
            <form   onSubmit={this.onSubmitHandler}>
              <div className="form-row form-group">
                <div className="col-12">
                  <label
                    className="label-white"
                    data-error="wrong"
                    data-success="right"
                    htmlFor="email"
                    >Username</label>
                  <input
                    type="text"
                    className="form-control validate"
                    id="email"
                    name="email"
                    required=""
                    onChange={this.onChangeHandler}
                  />
                </div>
              </div>
              <div className="form-row form-group">
                <div className="col-12 ">
                  <label
                    className="label-white"
                    data-error="wrong"
                    data-success="right"
                    htmlFor="password"
                    >Password</label>

                  <input
                    type="password"
                    className="form-control validate"
                    id="password"
                    name="password"
                    required=""
                    onChange={this.onChangeHandler} 
                  />
                </div>
              </div>
              <div className="form-row form-group">
                <div className="col-12">
                  <label className="form-csCheck remember-me">
                    <input
                      className="form-check-input form-control validate"
                      type="checkbox"
                      value=""
                      id="user-remember"
                      required=""
                    />
                    <span className="form-csCheck-checkmark"></span>
                    Remember Me
                  </label>
                </div>
              </div>
              <div className="form-row form-group">
                <div className="col-12">
                  <button className="btn btn-success w-100" type="submit">
                    Login
                  </button>
                </div>
              </div>
           
            {/* <div href="#" className="text-center forgot-pw">
              Forgot Password
            </div> */}
        </form>
      </div>
    </div>

    )
  }
}
function mapDispatchToProps(dispatch){
  return{actions:bindActionCreators(login,dispatch)}
}
export default connect (mapDispatchToProps)(Login);


