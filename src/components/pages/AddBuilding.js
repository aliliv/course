import React, { Component } from "react";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import history from "../../history";
import * as Config from "../../config";
class AddBuilding extends Component {
  state = {
    IsAdd: true,
    Loading: false,
    Id: 0,
    Name: "",
    Number: "",
    Floor: 1,
    Floors: [],
    FloorLocation: 1,
    RoomNumber: "",
    Status: true,
    RoomCapacity: 1,
    RoomView: [],
  };
  async roomdelete(room)
  {
    this.setState({ Loading: true });
    await axios
      .post(Config.ApiUrl + "api/room/setpasive", room)
      .then((response) => {

        alertify.success(response.data, 4);
        this.getRooms();
        this.setState({ Loading: false });
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
  };
  onActiveHandler = (event) => {
    switch (event.target.value) {
      case "true":
        this.setState({ Status: true });
        break;

      default:
        this.setState({ Status: false });
        break;
    }
  };
  async getRooms() {
    await axios
      .get(
        Config.ApiUrl +
          "api/room/getbuildingrooms?buildingid=" +
          parseInt(this.state.Id)
      )
      .then((r) => {
        this.setState({ RoomView: r.data });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  onRoomSubmitHandler = async (event) => {
    event.preventDefault();
    this.setState({ Loading: true });
    let obj = {
      BuildingId: parseInt(this.state.Id),
      RoomCapacity: parseInt(this.state.RoomCapacity),
      RoomNumber: this.state.RoomNumber,
      FloorLocation: parseInt(this.state.FloorLocation),
      Status: true,
    };

    await axios
      .post(Config.ApiUrl + "api/room/add", obj)
      .then((response) => {
        alertify.success(response.data, 4);
        this.getRooms();
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
  };
  onSubmitHandler = async (event) => {
    event.preventDefault();
    this.setState({ Loading: true });
    let obj = {
      Id: parseInt(this.state.Id),
      Name: this.state.Name,
      Number: this.state.Number,
      Floor: parseInt(this.state.Floor),
      Status: this.state.Status,
    };

    await axios
      .post(Config.ApiUrl + "api/building/add", obj)
      .then((response) => {
        for (let index = 1; index <= parseInt(this.state.Floor); index++) {
          this.state.Floors.push(index);
        }
        if(this.state.IsAdd===true)
        {
          this.setState({ Id: response.data.data.id });
          this.setState({ IsAdd: false });
          alertify.success(response.data.message, 4);
        }
        else
        {
          alertify.success(response.data, 4);
        }

      

      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
  };

  async componentDidMount() {
    if (this.props.token) {
      if (history.location.state) { 
        this.setState({ IsAdd: false }); 
        await axios
        .get(
          Config.ApiUrl + "api/building/getbyid?buildingid=" +
            history.location.state.id
        )
        .then(r => {
           this.setState({ Id: parseInt(r.data.id)});
           this.setState({ Name: r.data.name });
           this.setState({ Number: r.data.number });
           this.setState({ Floor: parseInt(r.data.floor)});
           this.setState({ Status: r.data.status });
        })
        .catch(error => {
          console.log(error.response);
        });
        this.getRooms();
      
      }
    } else {
    }
  }
  render() {
    return (
      <div>
        {this.state.IsAdd && <div className="content-title">Add Building</div>}
        {!this.state.IsAdd && (
          <div className="content-title">Building Update</div>
        )}

        <form onSubmit={this.onSubmitHandler}>
          <div className="row">
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="ClassName">Building Name:</label>
              <input
                className="form-control"
                value={this.state.Name}
                name="Name"
                id="Name"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Capacity">Building Number:</label>
              <input
                className="form-control"
                value={this.state.Number}
                name="Number"
                id="Number"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Capacity">Number of Floor:</label>
              <input
                className="form-control"
                type="number"
                value={this.state.Floor}
                name="Floor"
                id="Floor"
                min="1"
                onChange={this.onChangeHandler}
                required
              />
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Status">Status:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  name="Status"
                  id="Status"
                  onChange={this.onActiveHandler}
                  value={this.state.Status}
                >
                  <option value={true}> Active </option>
                  <option value={false}> Pasive </option>
                </select>
              </div>
            </div>
          </div>

          <Button type="submit" color="success" disabled={this.state.Loading}>
            {this.state.Loading && <i className="ri-loader-4-line ri-spin"></i>}
            {!this.state.Loading && <span> Save</span>}
            {this.state.Loading && <span> Wait ...</span>}
          </Button>
        </form>
        {!this.state.IsAdd && (
          <div>
            <div className="mt-5 content-title">Add Room</div>
            <form onSubmit={this.onRoomSubmitHandler}>
              <div className="row">
                <div className="form-group col-12 col-sm-6 col-lg-3">
                  <label htmlFor="FloorLocation">Floor Location:</label>
                  <div className="form-select">
                    <select
                      className="form-control"
                      type="select"
                      name="FloorLocation"
                      id="FloorLocation"
                      value={this.state.FloorLocation}
                      onChange={this.onChangeHandler}
                    >
                      {this.state.Floors.map((floor) => (
                        <option key={floor} value={floor}>
                          {floor}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group col-12 col-sm-6 col-lg-3">
                  <label htmlFor="RoomNumber">Room Number:</label>
                  <input
                    className="form-control"
                    value={this.state.RoomNumber}
                    name="RoomNumber"
                    id="RoomNumber"
                    onChange={this.onChangeHandler}
                    required
                  />
                </div>
                <div className="form-group col-12 col-sm-6 col-lg-3">
                  <label htmlFor="Capacity">RoomCapacity:</label>
                  <input
                    className="form-control"
                    type="number"
                    value={this.state.RoomCapacity}
                    name="RoomCapacity"
                    id="RoomCapacity"
                    min="1"
                    onChange={this.onChangeHandler}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                color="success"
                disabled={this.state.Loading}
              >
                {this.state.Loading && (
                  <i className="ri-loader-4-line ri-spin"></i>
                )}
                {!this.state.Loading && <span> Add</span>}
                {this.state.Loading && <span> Wait ...</span>}
              </Button>
            </form>

            <div className="row">
              <div className="col-12">
                <div className="table-wrapper">
                  <div className="table table-responsive">
                    <div className="ttop">
                      <div className="thead">
                        <div className="tr">
                          <div className="td">Floor Location</div>
                          <div className="td">Room Number</div>
                          <div className="td">Room Capacity</div>
                          <div className="td"></div>
                        </div>
                      </div>
                      <div className="tbody">
                        {this.state.RoomView.map((title, index) => {
                          return <div key={`room-${index}`} className="tr">
                            <div className="td">{title.floorLocation}</div>
                            <div className="td">{title.roomNumber}</div>
                            <div className="td">{title.roomCapacity}</div>
                            <div className="td"><a  className="btn text-danger" onClick={()=>this.roomdelete(title)}>
                              Delete
                            </a>
                              </div>

                          </div>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(AddBuilding);
