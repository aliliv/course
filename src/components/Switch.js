import React, { Component } from 'react';

export default class Switch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || false,
    };
  }

  toggleSwitch = (value) => {
    this.setState({
      value: value,
    });
    this.props.toggleSwitch(this.state.value);
  };
  render() {
    return (
      <label className="switch">
        <input
          type="checkbox"
          value={this.state.value}
          checked={this.state.value}
          onChange={(e) => this.toggleSwitch(e.target.checked)}
        />
        <span className="slider round"></span>
      </label>
    );
  }
}
