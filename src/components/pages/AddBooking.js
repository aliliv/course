import React, { Component } from "react";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import history from "../../history";
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import * as Config from "../../config";
class AddBooking extends Component {
  state = {
    IsAdd: true,
    Loading: false,
    Id:0,
    Building: 0,
    Room: 0,
    Bed: 0,
    CheckInDate: new Date(),
    CheckOutDate: new Date(),
    Name: '',
    LastName:'',
    Buildings: [],
    Rooms:[],
    Beds:[],
    Status: true,
  };
  async componentDidMount() {
    await axios
    .get(Config.ApiUrl + "api/building/getlist")
    .then((r) => {
      this.setState({ Buildings: r.data });
      if(r.data.length>0)
        this.setState({Building:r.data[0].id});
    })
    .catch((error) => {
      console.log(error.response);
    });
    
    if (history.location.state) {
      
      if(history.location.state.id==null)//BuildingReport redirect
      {
        this.setState({ Building: history.location.state.buildingid });
        this.setState({ Room: history.location.state.roomid});
        this.setState({ Bed: history.location.state.bedno });
        this.setState({ CheckInDate: history.location.state.bookingDate});
        this.setState({ CheckOutDate: history.location.state.bookingDate});
      }
      else//Edit redirect
      {
        this.setState({ IsAdd: false });
        await axios
          .get(
            Config.ApiUrl +
              'api/booking/getbyid?bookingid=' +
              history.location.state.id
          )
          .then((r) => {
             this.setState({ Id: r.data.id });
             this.setState({ Name: r.data.name });
             this.setState({ LastName: r.data.lastName });
             this.setState({ Building: r.data.building });
             this.setState({ Bed: r.data.bed });
             this.setState({ Room: r.data.room });
             this.setState({ CheckInDate:  new Date(moment(r.data.checkInDate).format('YYYY,MM,DD'))});
             this.setState({ CheckOutDate: new Date(moment(r.data.checkOutDate).format('YYYY,MM,DD'))});
             this.setState({ Status: r.data.status});
          })
          .catch((error) => {
            console.log(error.response);
          });
      }

    }
    await this.getRooms(this.state.Building);
    if(parseInt(this.state.Room)===0 && this.state.Rooms.length>0)
    {
      this.setState({Room:this.state.Rooms[0].id});
      await  this.getBedList(this.state.Room);
      if(this.state.Beds.length>0 && parseInt(this.state.Bed)===0)
      {
       this.setState({Bed:this.state.Beds[0]});
      }
    }
    else
    {
      await  this.getBedList(this.state.Room);
      if(this.state.Beds.length>0 && parseInt(this.state.Bed)===0)
      {
       this.setState({Bed:this.state.Beds[0]});
      }
    }

  }
  onActiveHandler = (event) => {
    switch (event.target.value) {
      case 'true':
        this.setState({ Status: true });
        break;

      default:
        this.setState({ Status: false });
        break;
    }
  };
  async getRooms(buildingid){
    await axios
    .get(
      Config.ApiUrl +
        "api/room/getbuildingrooms?buildingid=" +
        parseInt(buildingid)
    )
    .then((r) => {
      this.setState({Rooms:r.data});
    })
    .catch((error) => {
      console.log(error.response);
    });

  }
  async getBedList(roomid){
    for (let index = 0; index < this.state.Rooms.length; index++) {
      if(parseInt(this.state.Rooms[index].id)===parseInt(roomid)){
        var beds=[];
        for (let z = 1; z <= parseInt(this.state.Rooms[index].roomCapacity); z++) {
          beds.push(z);
        }
        this.setState({Beds:beds});
      }
    }
  }
  onChangeHandler = async (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
    if(name==="Building"){
     await this.getRooms(value);
     if(this.state.Rooms.length>0)//Building changes select first room
     {
      this.setState({Room:this.state.Rooms[0].id});
     }
    }
    else if(name==="Room")
    {
      this.getBedList(value);
      if(this.state.Beds.length>0)//Room changes select first bed
      {
       this.setState({Bed:this.state.Beds[0]});
      }
    }
  };
  onSubmitHandler = async (event) => {
    event.preventDefault();
    this.setState({ Loading: true });
    if(this.state.CheckOutDate<this.state.CheckInDate){
      alertify.error("CheckInDate cannot be greater than CheckOutDate!", 4);
      this.setState({ Loading: false });
          return;
    }
    let obj = {
      Id: parseInt(this.state.Id),
      Building: parseInt(this.state.Building),
      Room: parseInt(this.state.Room),
      Bed: parseInt(this.state.Bed),
      Name: this.state.Name,
      LastName: this.state.LastName,
      CheckInDate:moment(this.state.CheckInDate).format('MM.DD.YYYY'),
      CheckOutDate:moment(this.state.CheckOutDate).format('MM.DD.YYYY'),
      Status:this.state.Status,
    };
    await axios
      .post(Config.ApiUrl + "api/booking/add", obj)
      .then((response) => {
        alertify.success(response.data, 4);
        history.push("/BookingSearch");
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
  };
  checkinDateChange = (date) => {
    this.setState({
      CheckInDate: date,
    });
  };
  checkoutDateChange = (date) => {
    this.setState({
      CheckOutDate: date,
    });
  };
  render() {
    return (
      <div>
        {this.state.IsAdd && <div className="content-title">Add Booking</div>}
        {!this.state.IsAdd && (
          <div className="content-title">Booking Update</div>
        )}
        <form onSubmit={this.onSubmitHandler}>
          <div className="row">
          <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Building">Building:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  value={this.state.Building}
                  type="select"
                  name="Building"
                  id="Building"
                  onChange={this.onChangeHandler}
                >
                  {this.state.Buildings.map((building) => (
                    <option key={'building'+building.id} value={building.id}>
                      {building.name}-{building.number}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Room">Room:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  value={this.state.Room}
                  type="select"
                  name="Room"
                  id="Room"
                  onChange={this.onChangeHandler}
                >
                  {this.state.Rooms.map((room) => (
                    <option key={'room'+room.id} value={room.id}>
                     Number:{room.roomNumber}-Floor:{room.floorLocation}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Bed">Bed:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  value={this.state.Bed}
                  type="select"
                  name="Bed"
                  id="Bed"
                  onChange={this.onChangeHandler}
                >
                  {this.state.Beds.map((bed) => (
                    <option key={'bed'+bed} value={bed}>
                     {bed}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Name">Name:</label>
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
              <label htmlFor="LastName">Last Name:</label>
              <input
                className="form-control"
                value={this.state.LastName}
                name="LastName"
                id="LastName"
                onChange={this.onChangeHandler}
                required
              />
            </div>
     
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="CheckInDate">CheckIn Date:</label>
              <div className="form-select">
                <DatePicker
                  className="form-control"
                  selected={this.state.CheckInDate}
                  onChange={this.checkinDateChange}
                />
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="CheckOutDate">CheckOut Date:</label>
              <div className="form-select">
                <DatePicker
                  className="form-control"
                  selected={this.state.CheckOutDate}
                  onChange={this.checkoutDateChange}
                />
              </div>
            </div>
            <div className="form-group col-12 col-md-3 col-lg-3">
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
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(AddBooking);
