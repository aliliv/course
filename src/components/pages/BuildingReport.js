import React, { Component } from "react";
import axios from "axios";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import history from "../../history";
import * as Config from "../../config";
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
class BuildingReport extends Component {
  state = {
    Buildings: [],
    Loading: false,
    Building: 0,
    Floors: [],
    Floor: 0,
    Rooms:[],
    Bookingdate: new Date(),
    BookingList:[],
  };
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
   dateChange = (date) => {
    this.setState({
      Bookingdate: date,
    });
  };

  async getRooms() {
    await axios
      .get(
        Config.ApiUrl +
          "api/room/getbuildingrooms?buildingid=" +
          parseInt(this.state.Building)
      )
      .then((r) => {
        this.setState({Rooms:r.data});
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  // returnroomview(floor){
  //   let returntext='';
  //   for (let index = 0; index < this.state.Rooms.length; index++) {
  //     if(this.state.Rooms[index].floorLocation===parseInt(floor))
  //     {
  //       let beds='';
  //       for(let j=1;j<=this.state.Rooms[index].roomCapacity;j++){
  //         beds+="<div  onClick=\"(e)=>this.BookingCheck(e)\"  class=\"border border-dark ml-3 bg-primary\">Bed"+j+"</div>"
  //       }
  //       beds="<div class=\"row\">"+beds+"</div>";
  //       returntext+="<div  class=\"border border-dark col\">Room Number:"+this.state.Rooms[index].roomNumber+" "+beds+"</div>"
  //     }
  //   }
  //   returntext="<div class=\"row\">"+returntext+"</div>"
  //   return returntext ;
  // }
  floorRender(floor){
    let floorlist=[];
        for (let index = 0; index < this.state.Rooms.length; index++) {
        if(this.state.Rooms[index].floorLocation===parseInt(floor))
        {
          floorlist.push(this.state.Rooms[index]);
        }
      }
     
      return floorlist;
  }
  bookingcheck(room,bad)
  {
    var obj={'bedno':bad,color:'bg-white',id:0};
    for (let index = 0; index < this.state.BookingList.length; index++) {
      if(parseInt(this.state.BookingList[index].bed)===parseInt(bad) &&
      parseInt(this.state.BookingList[index].building)===parseInt(this.state.Building) &&
      parseInt(this.state.BookingList[index].room)===parseInt(room))
      {
        obj.bedno=this.state.BookingList[index].name+"  "+this.state.BookingList[index].lastName;
        obj.color='bg-info';
        obj.id=this.state.BookingList[index].id;
      }
    }
    return obj;
  }
  returnbed(capacity,roomid){
    let bedlist=[];
    var obj;
    for (let index = 1; index <= capacity; index++) {
      var data=this.bookingcheck(roomid,index);
      obj={'bedno':data.bedno,'key':roomid,'color':data.color,'id':data.id}
      bedlist.push(obj);
    }
    return bedlist;
  }
  // returnbed(capacity,roomnumber){
  //   let bedlist=[];
  //   var obj;
  //   for (let index = 1; index <= capacity; index++) {
  //     obj={'bedno':index,'key':roomnumber}
  //     bedlist.push(obj);
  //   }
  //   return bedlist;
  // }

  async getFloorList(){
    let floorlist = [];
    for (let index =  parseInt(this.state.Floor); 1 <= index; index--) {
      floorlist.push(index);
    }
    this.setState({ Floors: floorlist });
  }
  onSubmitHandler = async (event) => {
    event.preventDefault();
    await axios
      .get(
        Config.ApiUrl +
          "api/building/getbyid?buildingid=" +
          parseInt(this.state.Building)
      )
      .then((c) => {
        this.setState({ Floor: c.data.floor });
      })
      .catch((error) => {
        console.log(error.response);
      });
      await this.getFloorList();
      await this.getRooms();
      let obj = {
        BuildingId: parseInt(this.state.Building),
        Date: moment(this.state.Bookingdate).format('YYYY,MM,DD'),
      };
      await axios
      .post(Config.ApiUrl + 'api/booking/buildingbookinglist', obj)
      .then((r) => {
        this.setState({BookingList:r.data});
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
  };
  async bookingredirect(buildingid,roomid,bedno,bookingid){
    if(parseInt(bookingid)===0)
    {
      history.push({
        pathname: '/AddBooking',
        search: '',
        state: { 'buildingid': buildingid,'roomid':roomid,'bedno':bedno,'bookingDate': this.state.Bookingdate },
      });
    }
    else{
      history.push({
        pathname: '/AddBooking',
        search: '',
        state: { 'buildingid': buildingid,'roomid':roomid,'bedno':bedno,'bookingDate': this.state.Bookingdate,'id':bookingid},
      });
    }
 
  }

  async componentDidMount() {
    this.setState({ Loading: true });
    await axios
      .get(Config.ApiUrl + "api/building/getlist")
      .then((r) => {
        this.setState({ Buildings: r.data });
        if(r.data.length>0)
          this.setState({Building:r.data[0].id})
      })
      .catch((error) => {
        console.log(error.response);
      });
     this.setState({ Loading: false });
  }
  render() {
    return (
      <div>
        <form onSubmit={this.onSubmitHandler}>
          <div className="row align-items-end">
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
                    <option key={building.id} value={building.id}>
                      {building.name}-{building.number}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Bookingdate">Booking Date:</label>
              <div className="form-select">
                <DatePicker
                  className="form-control"
                  selected={this.state.Bookingdate}
                  onChange={this.dateChange}
                />
              </div>
            </div>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <Button
                type="submit"
                color="success"
                disabled={this.state.Loading}
              >
                {this.state.Loading && (
                  <i className="ri-loader-4-line ri-spin"></i>
                )}
                {!this.state.Loading && <span> Search</span>}
                {this.state.Loading && <span> Wait ...</span>}
              </Button>
            </div>
          </div>
        </form>
        <div className="row">
          {this.state.Floors.map((floor) => (
            <div className="row col-12 border border-dark" key={floor+"floor"} value={floor}>
              <div className="col-1 border-right border-dark">{floor}</div>
              <div className="col-11 row">
              {/* <div dangerouslySetInnerHTML={{ __html: this.returnroomview(floor) }} />*/}
              {this.floorRender(floor).map((room) => (
                <div className="border border-info ml-1 mt-1 mb-1 col" key={`${room.id}-room-${room.roomNumber}`}>Room Number:{room.roomNumber}
                {this.returnbed(room.roomCapacity,room.id).map((bed) => (
                    <div className={"border border-dark col baddiv "+bed.color} key={`${bed.bedno}-bed-${bed.key}`}  
                    onClick={()=>this.bookingredirect(room.buildingId,room.id,bed.bedno,bed.id)}>
                     {/* {()=>this.bookingcheck(room.id,bed.bedno)} */}
                      {bed.bedno}
                      </div>
                 ))}
                </div>
              ))}
              </div>         
            </div>
          ))}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(BuildingReport);
