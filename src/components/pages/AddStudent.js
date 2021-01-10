import React, { Component } from 'react';
import axios from 'axios';
import alertify from 'alertifyjs';
import { connect } from 'react-redux';
import history from '../../history';
import DatePicker from 'react-datepicker';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Collapse,
} from 'reactstrap';
import classnames from 'classnames';
import { Button } from 'reactstrap';
import S3FileUpload from 'react-s3';
import StudentAttendance from '../pages/StudentAttendance';
import * as Config from '../../config';
import * as moment from 'moment';
import { Confirm, Modal } from 'semantic-ui-react';
// import { CognitoIdentityServiceProvider } from "aws-sdk";
class AddStudent extends Component {
  state = {
    Id: 0,
    activeTab: '1',
    StudentId: '',
    SevisNo: '',
    PlacementScore: '',
    VisaTypes: [],
    VisaType: '',
    date: new Date(),
    timeoffstartdate: new Date(),
    timeoffenddate: new Date(),
    outofcountrystartdate: new Date(),
    outofcountryenddate: new Date(),
    Agencies: [],
    AgencyId: '',
    Note: '',
    User: '',
    Loading: false,
    FileLoading: false,
    FileName: '',
    FileLocation: '',
    FileTypes: [],
    FileTypeId: '',
    Sessions: [],
    File: '',
    BranchId: '',
    SessionId: '',
    UserFiles: [],
    IsAdd: true,
    IsVisibleNewCourse: false,
    IsVisibleTimeOff: false,
    IsVisibleOutOffCountry: false,
    TimeOffNote: '',
    OutOfCountryNote: '',
    CourseView: [],
    open: false,
    deleteobj: '',
    Invoices: [],
    ActiveAcordion: -1,
    invoiceaddmodal: false,
    addinvoicesessionid: 0,
    PaymentTypes: [],
    PaymentTypeId: '',
    paymentmodal: false,
    paymentaddedinvoiceid: 0,
    PaymentMethods: [],
    PaymentMethodId: 0,
    PaymentAmount: 0,
    PaymentDescription: '',
    IsPayment: true,
    Payments: [],
    UsaAddress: '',
    StateCode: '',
    CityId: 0,
    ZipCode: '',
    EmergencyCallPerson: '',
    States: [],
    Citys: [],
  };
  gettotal(invoiceamount, invoiceid) {
    let total = 0;
    for (let index = 0; index < this.state.Payments.length; index++) {
      if (
        parseInt(this.state.Payments[index].invoiceId) === parseInt(invoiceid)
      ) {
        if (this.state.Payments[index].isPayment) {
          total = total + parseInt(this.state.Payments[index].amount);
        } else {
          total = total - parseInt(this.state.Payments[index].amount);
        }
      }
    }
    return invoiceamount - total;
  }
  onIsPaymentActiveHandler = (event) => {
    switch (event.target.value) {
      case 'true':
        this.setState({ IsPayment: true });
        break;

      default:
        this.setState({ IsPayment: false });
        break;
    }
  };
  NewCourseVisibility() {
    this.setState({ IsVisibleNewCourse: !this.state.IsVisibleNewCourse });
    this.setState({ IsVisibleTimeOff: false });
    this.setState({ IsVisibleOutOffCountry: false });
  }
  TimeOffVisibility() {
    this.setState({ IsVisibleTimeOff: !this.state.IsVisibleTimeOff });
    this.setState({ IsVisibleNewCourse: false });
    this.setState({ IsVisibleOutOffCountry: false });
  }
  OutOfCountryVisibility() {
    this.setState({
      IsVisibleOutOffCountry: !this.state.IsVisibleOutOffCountry,
    });
    this.setState({ IsVisibleNewCourse: false });
    this.setState({ IsVisibleTimeOff: false });
  }
  async getFiles() {
    await axios
      .get(
        Config.ApiUrl +
          'api/studentfile/getallbyuserid?userid=' +
          parseInt(this.state.User.id)
      )
      .then((c) => {
        this.setState({ UserFiles: c.data });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  async getCourseView() {
    this.setState({ CourseView: [] });
    var viewlist = [];
    await axios
      .get(
        Config.ApiUrl +
          'api/timeoff/getbyuserid?userid=' +
          parseInt(this.state.User.id)
      )
      .then((c) => {
        for (let index = 0; index < c.data.length; index++) {
          var viewobj = {
            Order: index,
            Id: c.data[index].id,
            Course: 'TimeOff',
            StartDate: moment(c.data[index].startDate).format('MM/DD/YYYY'),
            EndDate: moment(c.data[index].endDate).format('MM/DD/YYYY'),
            EarlyLeavingDate: '',
            Teacher: '',
            Class: '',
            AssessmentGrade: '',
            ParticipationGrade: '',
            TotalGrade: '',
            Comment: c.data[index].note,
            ConditionalPass: '',
            Incomplete: '',
            AttendanceProbation: '',
            AcademicWarning: '',
            BehavioralWarning: '',
            SessionId: '',
          };
          viewlist.push(viewobj);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
    await axios
      .get(
        Config.ApiUrl +
          'api/outofcountry/getbyuserid?userid=' +
          parseInt(this.state.User.id)
      )
      .then((c) => {
        for (let index = 0; index < c.data.length; index++) {
          var viewobj = {
            Order: viewlist.length + 1,
            Id: c.data[index].id,
            Course: 'Out Of Country',
            StartDate: moment(c.data[index].startDate).format('MM/DD/YYYY'),
            EndDate: moment(c.data[index].endDate).format('MM/DD/YYYY'),
            EarlyLeavingDate: '',
            Teacher: '',
            Class: '',
            AssessmentGrade: '',
            ParticipationGrade: '',
            TotalGrade: '',
            Comment: c.data[index].note,
            ConditionalPass: '',
            Incomplete: '',
            AttendanceProbation: '',
            AcademicWarning: '',
            BehavioralWarning: '',
            SessionId: '',
          };
          viewlist.push(viewobj);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });

    await axios
      .get(
        Config.ApiUrl +
          'api/studentcourse/getbyuserid?userid=' +
          parseInt(history.location.state.id)
      )
      .then((c) => {
        for (let index = 0; index < c.data.length; index++) {
          var viewobj = {
            Order: viewlist.length + 1,
            Id: c.data[index].id,
            Course: c.data[index].courseName,
            StartDate: c.data[index].startDate,
            EndDate: c.data[index].endDate,
            EarlyLeavingDate: c.data[index].earlyLeavingDate,
            Teacher: c.data[index].teacher,
            Class: c.data[index].classroom,
            AssessmentGrade: c.data[index].assessmentGrade,
            ParticipationGrade: '',
            TotalGrade: '',
            Comment: c.data[index].note,
            ConditionalPass: c.data[index].conditionalPass,
            Incomplete: c.data[index].incomplete,
            AttendanceProbation: '',
            AcademicWarning: c.data[index].academicWarning,
            BehavioralWarning: c.data[index].behavioralWarning,
            SessionId: c.data[index].sesionId,
          };
          viewlist.push(viewobj);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
    this.setState({ CourseView: viewlist });
  }

  deletecourse(viewobj) {
    this.setState({ deleteobj: viewobj });
    this.setState({ open: true });
  }
  async getInvoices() {
    await axios
      .get(
        Config.ApiUrl +
          'api/invoice/getbyid?userid=' +
          parseInt(this.state.User.id)
      )
      .then((c) => {
        this.setState({ Invoices: c.data });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  async invoicedelete(invoiceid) {
    await axios
      .get(
        Config.ApiUrl + 'api/invoice/setpasive?invoiceid=' + parseInt(invoiceid)
      )
      .then((response) => {
        this.getpayments();
        this.getInvoices();
        alertify.success(response.data, 4);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  async getpayments() {
    await axios
      .get(
        Config.ApiUrl +
          'api/payment/getall?userid=' +
          parseInt(this.state.User.id)
      )
      .then((c) => {
        this.setState({ Payments: c.data });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  async componentDidMount() {
    this.setState({ BranchId: this.props.user.userBranches[0].id });
    await axios
      .get(
        Config.ApiUrl +
          'api/session/getactiveforbranch?branchid=' +
          parseInt(this.props.user.userBranches[0].id)
      )
      .then((c) => {
        this.setState({ Sessions: c.data });
        if (c.data.length > 0) {
          this.setState({ SessionId: c.data[0].id });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });

    await axios
      .get(Config.ApiUrl + 'api/state/getall')
      .then((c) => {
        this.setState({ States: c.data });
        if (c.data.length > 0 && this.state.StateCode === '') {
          this.getCity(c.data[0].state_code);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });

    await axios
      .get(Config.ApiUrl + 'api/visatype/getall')
      .then((c) => {
        this.setState({ VisaTypes: c.data });
        this.setState({ VisaType: this.state.VisaTypes[0].id });
      })
      .catch((error) => {
        console.log(error.response);
      });
    await axios
      .get(Config.ApiUrl + 'api/agency/getall')
      .then((c) => {
        this.setState({ Agencies: c.data });
        this.setState({ AgencyId: this.state.Agencies[0].id });
      })
      .catch((error) => {
        console.log(error.response);
      });
    await axios
      .get(Config.ApiUrl + 'api/studentfilestype/getall')
      .then((c) => {
        this.setState({ FileTypes: c.data });
        this.setState({ FileTypeId: c.data[0].id });
      })
      .catch((error) => {
        console.log(error.response);
      });
    await axios
      .get(
        Config.ApiUrl +
          'api/users/getbyuserid?id=' +
          parseInt(history.location.state.id)
      )
      .then((c) => {
        this.setState({ User: c.data });
        //console.log(c.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
    await axios
      .get(
        Config.ApiUrl +
          'api/student/getbyuserid?userid=' +
          parseInt(history.location.state.id)
      )
      .then((c) => {
        //  this.setState({ User: c.data });
        //console.log(c.data);
        if (c.data.message === '0') {
        } else {
          this.setState({
            date: new Date(moment(c.data.data.startDate).format('YYYY,MM,DD')),
          });
          this.setState({ IsAdd: false });
          this.setState({ StudentId: c.data.data.studentId });
          this.setState({ SevisNo: c.data.data.sevisNo });
          this.setState({ PlacementScore: c.data.data.placementScore });
          this.setState({ Note: c.data.data.note });
          this.setState({ VisaType: c.data.data.visaType });
          this.setState({ AgencyId: c.data.data.agencyId });
          this.setState({ Id: c.data.data.id });
          this.setState({ StateCode: c.data.data.stateCode });
          this.getCity(c.data.data.stateCode);
          this.setState({ CityId: parseInt(c.data.data.cityId) });
          this.setState({
            EmergencyCallPerson: c.data.data.emergencyCallPerson,
          });
          this.setState({ UsaAddress: c.data.data.usaAddress });
          this.setState({ ZipCode: c.data.data.zipCode });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });

    await axios
      .get(
        Config.ApiUrl +
          'api/paymenttype/getallforinstutionid?instutionid=' +
          parseInt(this.props.user.institutionId)
      )
      .then((c) => {
        this.setState({ PaymentTypes: c.data });
        if (c.data.length > 0) this.setState({ PaymentTypeId: c.data[0].id });
      })
      .catch((error) => {
        console.log(error.response);
      });

    await axios
      .get(
        Config.ApiUrl +
          'api/paymentmethod/getbyinstutionid?instutionid=' +
          parseInt(this.props.user.institutionId)
      )
      .then((c) => {
        this.setState({ PaymentMethods: c.data });
        if (c.data.length > 0) this.setState({ PaymentMethodId: c.data[0].id });
      })
      .catch((error) => {
        console.log(error.response);
      });

    await this.getpayments();

    await this.getCourseView();

    await this.getInvoices();

    this.getFiles();
  }
  async fileDelete(userfile) {
    var status = false;
    this.setState({ FileLoading: true });
    var name = userfile.locationUrl.substring(
      userfile.locationUrl.indexOf('StudentFile/') + 12,
      userfile.locationUrl.length
    );
    await S3FileUpload.deleteFile(name, Config.S3StudentFileconfig)
      .then((response) => {
        status = true;
      })
      .catch((err) => console.error(err));
    if (status === true) {
      let obj = {
        id: parseInt(userfile.id),
      };
      await axios
        .post(Config.ApiUrl + 'api/studentfile/delete', obj)
        .then((response) => {
          alertify.success(response.data, 4);
          this.getFiles();
        })
        .catch((error) => {
          alertify.error(error.response.data, 4);
        });
      this.setState({ FileLoading: false });
    }
  }
  async getCity(statecode) {
    await axios
      .get(Config.ApiUrl + 'api/city/getbystatecode?statecode=' + statecode)
      .then((c) => {
        this.setState({ Citys: c.data });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  onStateChangeHandler = async (event) => {
    let value = event.target.value;
    this.setState({ StateCode: value });
    this.getCity(value);
  };
  onChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };
  onBranchChangeHandler = async (event) => {
    let value = event.target.value;
    this.setState({ BranchId: value });
    await axios
      .get(
        Config.ApiUrl +
          'api/session/getactiveforbranch?branchid=' +
          parseInt(value)
      )
      .then((c) => {
        this.setState({ Sessions: c.data });
        if (c.data.length > 0) {
          this.setState({ SessionId: c.data[0].id });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });

    // this.setState({});
  };
  handleChange = (date) => {
    this.setState({
      date: date,
    });
  };
  timeoffstartdatehandleChange = (date) => {
    this.setState({
      timeoffstartdate: date,
    });
  };
  timeoffenddatehandleChange = (date) => {
    this.setState({
      timeoffenddate: date,
    });
  };
  outofcountrystartdatehandleChange = (date) => {
    this.setState({
      outofcountrystartdate: date,
    });
  };
  outofcountryenddatehandleChange = (date) => {
    this.setState({
      outofcountryenddate: date,
    });
  };
  SaveFile = async (event) => {
    event.preventDefault();
    if (this.state.File !== '' && this.state.FileName !== '') {
      this.setState({ FileLoading: true });
      await S3FileUpload.uploadFile(this.state.File, Config.S3StudentFileconfig)
        .then((data) => {
          this.setState({ FileLocation: data.location });
        })
        .catch((err) => console.error(err));
      let obj = {
        UserId: parseInt(this.state.User.id),
        Name: this.state.FileName,
        LocationUrl: this.state.FileLocation,
        StudentFilesType: parseInt(this.state.FileTypeId),
      };
      await axios
        .post(Config.ApiUrl + 'api/studentfile/add', obj)
        .then((response) => {
          //console.log(response.data);
          alertify.success(response.data, 4);
          this.getFiles();
        })
        .catch((error) => {
          alertify.error(error.response.data, 4);
        });
    } else {
      alertify.error('Fill in the required fields', 4);
    }
    this.setState({ FileLoading: false });
  };
  handleFile = (e) => {
    var blob = e.target.files[0].slice(0, e.target.files[0].size);
    var type = e.target.files[0].type;
    var extension = e.target.files[0].name.substring(
      e.target.files[0].name.indexOf('.'),
      e.target.files[0].name.length
    );
    var newFile = new File(
      [blob],
      e.target.files[0].name.substring(0, e.target.files[0].name.indexOf('.')) +
        Date.now() +
        extension,
      { type: type }
    );
    this.setState({ File: newFile });
  };
  async AddOutOffCountry() {
    this.setState({ Loading: true });
    let obj = {
      UserId: parseInt(this.state.User.id),
      StartDate: this.state.outofcountrystartdate,
      EndDate: this.state.outofcountryenddate,
      Note: this.state.OutOfCountryNote,
    };
    await axios
      .post(Config.ApiUrl + 'api/outofcountry/add', obj)
      .then((response) => {
        alertify.success(response.data.message, 4);
        this.setState({ IsVisibleOutOffCountry: false });
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    await this.getCourseView();
    this.setState({ Loading: false });
  }
  async AddTimeOff() {
    this.setState({ Loading: true });
    let obj = {
      UserId: parseInt(this.state.User.id),
      StartDate: this.state.timeoffstartdate,
      EndDate: this.state.timeoffenddate,
      Note: this.state.TimeOffNote,
    };
    await axios
      .post(Config.ApiUrl + 'api/timeoff/add', obj)
      .then((response) => {
        alertify.success(response.data.message, 4);
        this.setState({ IsVisibleTimeOff: false });
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    await this.getCourseView();
    this.setState({ Loading: false });
  }
  async AddCourse() {
    this.setState({ Loading: true });
    let obj = {
      UserId: parseInt(this.state.User.id),
      SesionId: parseInt(this.state.SessionId),
      Status: true,
    };
    let IsAdded = false;
    await axios
      .post(Config.ApiUrl + 'api/studentcourse/add', obj)
      .then((response) => {
        alertify.success(response.data, 4);
        this.setState({ IsVisibleNewCourse: false });
        this.getCourseView();
        if (response.data !== 'The existing course has been activated!')
          IsAdded = true;
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
        this.setState({ Loading: false });
        return;
      });
    if (IsAdded) {
      let paymentobj = {
        UserId: parseInt(this.state.User.id),
        SessionId: parseInt(this.state.SessionId),
        PaymentTypeId: 4,
        Date: new Date(),
        InstitutionId: parseInt(this.props.user.institutionId),
        Status: true,
      };
      await axios
        .post(Config.ApiUrl + 'api/invoice/add', paymentobj)
        .then((response) => {
          this.getInvoices();
        })
        .catch((error) => {
          alertify.error(error.response.data, 4);
        });
    }

    this.setState({ Loading: false });
  }
  onSubmitHandler = async (event) => {
    event.preventDefault();
    this.setState({ Loading: true });
    let obj = {
      Id: parseInt(this.state.Id),
      UserId: parseInt(this.state.User.id),
      StudentId: this.state.StudentId,
      SevisNo: this.state.SevisNo,
      PlacementScore: this.state.PlacementScore,
      Note: this.state.Note,
      StartDate: this.state.date,
      AgencyId: parseInt(this.state.AgencyId),
      VisaType: parseInt(this.state.VisaType),
      UsaAddress: this.state.UsaAddress,
      StateCode: this.state.StateCode,
      CityId: parseInt(this.state.CityId),
      ZipCode: this.state.ZipCode,
      EmergencyCallPerson: this.state.EmergencyCallPerson,
    };

    await axios
      .post(Config.ApiUrl + 'api/student/add', obj)
      .then((response) => {
        alertify.success(response.data, 4);
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
    this.setState({ Loading: false });
    // history.push("/StudentSearch");
  };
  async paymentdelete(paymentid) {
    await axios
      .get(
        Config.ApiUrl + 'api/payment/setpasive?paymentid=' + parseInt(paymentid)
      )
      .then((response) => {
        this.getpayments();
        alertify.success(response.data, 4);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  async ActiveSet(index) {
    if (parseInt(this.state.ActiveAcordion) === parseInt(index)) {
      this.setState({ ActiveAcordion: -1 });
    } else this.setState({ ActiveAcordion: parseInt(index) });
  }
  async SaveInvoice() {
    let paymentobj = {
      UserId: parseInt(this.state.User.id),
      SessionId: parseInt(this.state.addinvoicesessionid),
      PaymentTypeId: this.state.PaymentTypeId,
      Date: new Date(),
      InstitutionId: parseInt(this.props.user.institutionId),
      Status: true,
    };

    await axios
      .post(Config.ApiUrl + 'api/invoice/add', paymentobj)
      .then((response) => {
        alertify.success(response.data, 4);
        this.getInvoices();
        this.setState({ invoiceaddmodal: false });
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
  }
  acordionactiveclass(index) {
    if (parseInt(this.state.ActiveAcordion) === parseInt(index)) {
      return 'collapse show';
    } else return 'collapse';
  }
  async paymentadd() {
    let obj = {
      InvoiceId: parseInt(this.state.paymentaddedinvoiceid),
      IsPayment: this.state.IsPayment,
      PaymentMethodId: parseInt(this.state.PaymentMethodId),
      Amount: parseFloat(this.state.PaymentAmount),
      Description: this.state.PaymentDescription,
      Date: new Date(),
      Status: true,
    };
    await axios
      .post(Config.ApiUrl + 'api/payment/add', obj)
      .then((response) => {
        alertify.success(response.data, 4);
        this.getpayments();
        this.setState({
          paymentmodal: false,
          PaymentDescription: '',
          PaymentAmount: 0,
        });
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
  }
  async confirmok() {
    if (this.state.deleteobj.Course === 'TimeOff') {
      await axios
        .get(
          Config.ApiUrl +
            'api/timeoff/delete?timeoffid=' +
            this.state.deleteobj.Id
        )
        .then((c) => {
          alertify.success(c.data, 4);
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else if (this.state.deleteobj.Course === 'Out Of Country') {
      await axios
        .get(
          Config.ApiUrl +
            'api/outofcountry/delete?outofcountryid=' +
            this.state.deleteobj.Id
        )
        .then((c) => {
          alertify.success(c.data, 4);
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      await axios
        .get(
          Config.ApiUrl +
            'api/studentcourse/delete?id=' +
            this.state.deleteobj.Id
        )
        .then((c) => {
          alertify.success(c.data, 4);
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
    await this.getCourseView();
    this.setState({ open: false });
  }
  async ConditionalPassChange(studentcourseid) {
    await axios
      .get(
        Config.ApiUrl +
          'api/studentcourse/conditionalpasschange?studentcourseid=' +
          parseInt(studentcourseid)
      )
      .then((c) => {
        this.getCourseView();
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  async IncompleteChange(studentcourseid) {
    await axios
      .get(
        Config.ApiUrl +
          'api/studentcourse/incompletechange?studentcourseid=' +
          parseInt(studentcourseid)
      )
      .then((c) => {
        this.getCourseView();
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  earlyleavingdatechange = async (date, id) => {
    let obj = {
      StudentCourseId: parseInt(id),
      Date: date,
    };
    await axios
      .post(Config.ApiUrl + 'api/studentcourse/datechange', obj)
      .then((response) => {
        alertify.success(response.data, 4);
        this.getCourseView();
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
  };
  onAcademicWarningChange = async (e, id) => {
    let obj = {
      StudentCourseId: parseInt(id),
      Value: parseInt(e.target.value),
    };
    await axios
      .post(Config.ApiUrl + 'api/studentcourse/acedemicwarningchange', obj)
      .then((response) => {
        alertify.success(response.data, 4);
        this.getCourseView();
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
  };
  onBehavioralWarningChange = async (e, id) => {
    let obj = {
      StudentCourseId: parseInt(id),
      Value: parseInt(e.target.value),
    };
    await axios
      .post(Config.ApiUrl + 'api/studentcourse/behavioralwarningchange', obj)
      .then((response) => {
        alertify.success(response.data, 4);
        this.getCourseView();
      })
      .catch((error) => {
        alertify.error(error.response.data, 4);
      });
  };
  close = () => this.setState({ open: false });
  render() {
    return (
      <div>
        <Confirm
          className="confirmmodal"
          open={this.state.open}
          onCancel={this.close}
          onConfirm={() => this.confirmok()}
        />
        <Modal
          onClose={() => this.setState({ invoiceaddmodal: false })}
          open={this.state.invoiceaddmodal}
        >
          <Modal.Header>Add İnvoice</Modal.Header>
          <Modal.Content>
            <div className="form-group col-12 col-sm-6 col-lg-3">
              <label htmlFor="Branch">Payment Types:</label>
              <div className="form-select">
                <select
                  className="form-control"
                  type="select"
                  name="PaymentTypeId"
                  id="PaymentTypeId"
                  onChange={this.onChangeHandler}
                >
                  {this.state.PaymentTypes.map((paymenttype) => (
                    <option key={paymenttype.id} value={paymenttype.id}>
                      {paymenttype.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <button
              className="btn btn-success"
              onClick={() => this.SaveInvoice()}
            >
              Save
            </button>
          </Modal.Actions>
        </Modal>

        <Modal
          onClose={() => this.setState({ paymentmodal: false })}
          open={this.state.paymentmodal}
        >
          <Modal.Header>Add Payment</Modal.Header>
          <Modal.Content>
            <div className="row">
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="Status">Type:</label>
                <div className="form-select">
                  <select
                    className="form-control"
                    name="PaymentType"
                    id="PaymentType"
                    onChange={this.onIsPaymentActiveHandler}
                    value={this.state.IsPayment}
                  >
                    <option value={true}> Payment </option>
                    <option value={false}> Refund </option>
                  </select>
                </div>
              </div>
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="PaymentMethodId">Payment Methods:</label>
                <div className="form-select">
                  <select
                    className="form-control"
                    type="select"
                    name="PaymentMethodId"
                    id="PaymentMethodId"
                    onChange={this.onChangeHandler}
                    value={this.state.PaymentMethodId}
                  >
                    {this.state.PaymentMethods.map((paymentmethod) => (
                      <option key={paymentmethod.id} value={paymentmethod.id}>
                        {paymentmethod.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="PaymentAmount">Amount:</label>
                <input
                  className="form-control"
                  value={this.state.PaymentAmount}
                  name="PaymentAmount"
                  id="PaymentAmount"
                  onChange={this.onChangeHandler}
                  type="number"
                />
              </div>
              <div className="form-group col-12 col-sm-6 col-lg-3">
                <label htmlFor="PaymentDescription">Description:</label>
                <textarea
                  className="form-control"
                  value={this.state.PaymentDescription}
                  name="PaymentDescription"
                  id="PaymentDescription"
                  onChange={this.onChangeHandler}
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <button
              className="btn btn-success"
              onClick={() => this.paymentadd()}
            >
              Save
            </button>
          </Modal.Actions>
        </Modal>

        <div className="row add-student">
          <div className="col-12">
            <div className="content-title">Student</div>
          </div>
          <div className="col-12">
            <div className="custom-nav d-flex">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '1',
                    })}
                    onClick={() => {
                      this.setState({ activeTab: '1' });
                    }}
                  >
                    Student Information
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '2',
                    })}
                    onClick={() => {
                      this.setState({ activeTab: '2' });
                    }}
                  >
                    Courses
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '3',
                    })}
                    onClick={() => {
                      this.setState({ activeTab: '3' });
                    }}
                  >
                    Payments
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '4',
                    })}
                    onClick={() => {
                      this.setState({ activeTab: '4' });
                    }}
                  >
                    Attendance
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '5',
                    })}
                    onClick={() => {
                      this.setState({ activeTab: '5' });
                    }}
                  >
                    Applications
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '6',
                    })}
                    onClick={() => {
                      this.setState({ activeTab: '6' });
                    }}
                  >
                    Files
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === '7',
                    })}
                    onClick={() => {
                      this.setState({ activeTab: '7' });
                    }}
                  >
                    Accomodation
                  </NavLink>
                </NavItem>
              </Nav>
              <div className="d-flex align-items-center ml-auto">
                <img
                  className="student-img"
                  src={this.state.User.imageName}
                  alt=""
                />
                <span>
                  {this.state.User.firstName} {this.state.User.lastName}
                </span>
              </div>
            </div>
          </div>
          <div className="col-12">
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <form onSubmit={this.onSubmitHandler}>
                  <div className="row">
                    <div className="col-12 col-md-3 col-lg-3">
                      <div className="form-group">
                        <label htmlFor="StudentId">StudentId</label>
                        <input
                          className="form-control"
                          type="text"
                          name="StudentId"
                          id="StudentId"
                          value={this.state.StudentId}
                          onChange={this.onChangeHandler}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="VisaType">Visa Type:</label>
                        <div className="form-select">
                          <select
                            className="form-control"
                            value={this.state.VisaType}
                            type="select"
                            name="VisaType"
                            id="VisaType"
                            onChange={this.onChangeHandler}
                          >
                            {this.state.VisaTypes.map((visatype) => (
                              <option key={visatype.id} value={visatype.id}>
                                {visatype.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-3 col-lg-3">
                      <div className="form-group">
                        <label htmlFor="Address">Emergency Call Person:</label>
                        <textarea
                          className="form-control single-line"
                          name="EmergencyCallPerson"
                          id="EmergencyCallPerson"
                          value={this.state.EmergencyCallPerson}
                          onChange={this.onChangeHandler}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="VisaType">State:</label>
                        <div className="form-select">
                          <select
                            className="form-control"
                            value={this.state.StateCode}
                            type="select"
                            name="StateCode"
                            id="StateCode"
                            onChange={this.onStateChangeHandler}
                          >
                            {this.state.States.map((state) => (
                              <option key={state.id} value={state.state_code}>
                                {state.state}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-3 col-lg-3">
                      <div className="form-group">
                        <label htmlFor="ZipCode">Zip Code</label>
                        <input
                          className="form-control"
                          type="text"
                          name="ZipCode"
                          id="ZipCode"
                          value={this.state.ZipCode}
                          onChange={this.onChangeHandler}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="VisaType">City:</label>
                        <div className="form-select">
                          <select
                            className="form-control"
                            value={this.state.CityId}
                            type="select"
                            name="CityId"
                            id="CityId"
                            onChange={this.onChangeHandler}
                          >
                            {this.state.Citys.map((city) => (
                              <option key={city.id} value={city.id}>
                                {city.city}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-12 col-md-3 col-lg-3">
                      <label htmlFor="Address">Usa Address:</label>
                      <textarea
                        className="form-control"
                        name="UsaAddress"
                        id="UsaAddress"
                        value={this.state.UsaAddress}
                        onChange={this.onChangeHandler}
                      />
                    </div>

                    <div className="col-12 col-md-3 col-lg-3">
                      <div className="form-group">
                        <label htmlFor="StudentId">SevisNo</label>
                        <input
                          className="form-control"
                          type="text"
                          name="SevisNo"
                          id="SevisNo"
                          value={this.state.SevisNo}
                          onChange={this.onChangeHandler}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleDate">StartDate:</label>
                        <div className="form-select">
                          <DatePicker
                            className="form-control"
                            selected={this.state.date}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-3 col-lg-3">
                      <div className="form-group">
                        <label htmlFor="StudentId">PlacementScore</label>
                        <input
                          className="form-control"
                          type="text"
                          name="PlacementScore"
                          id="PlacementScore"
                          value={this.state.PlacementScore}
                          onChange={this.onChangeHandler}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="VisaType">Agency:</label>
                        <div className="form-select">
                          <select
                            className="form-control"
                            value={this.state.AgencyId}
                            type="select"
                            name="AgencyId"
                            id="AgencyId"
                            onChange={this.onChangeHandler}
                          >
                            {this.state.Agencies.map((agency) => (
                              <option key={agency.id} value={agency.id}>
                                {agency.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-12 col-md-6  col-lg-6">
                      <label htmlFor="Address">Note:</label>
                      <textarea
                        className="form-control"
                        name="Note"
                        id="Note"
                        value={this.state.Note}
                        onChange={this.onChangeHandler}
                      />
                    </div>
                  </div>
                  <Button
                    color="primary"
                    className="mr-3"
                    type="submit"
                    disabled={this.state.Loading}
                  >
                    {this.state.Loading && (
                      <i className="ri-loader-4-line ri-spin"></i>
                    )}
                    {!this.state.Loading && (
                      <span>
                        {this.state.IsAdd === true ? 'Add' : 'Update'}
                      </span>
                    )}
                    {this.state.Loading && <span> Wait ...</span>}
                  </Button>
                </form>
              </TabPane>
              <TabPane tabId="2">
                <div className="d-flex">
                  <div
                    className={
                      'course-tab' +
                      (this.state.IsVisibleNewCourse ? ' active' : '')
                    }
                    onClick={() => this.NewCourseVisibility()}
                  >
                    Enroll To A New Course
                  </div>
                  <div
                    onClick={() => this.TimeOffVisibility()}
                    className={
                      'ml-4 course-tab' +
                      (this.state.IsVisibleTimeOff ? ' active' : '')
                    }
                  >
                    Time Off
                  </div>
                  <div
                    onClick={() => this.OutOfCountryVisibility()}
                    className={
                      'ml-4 course-tab' +
                      (this.state.IsVisibleOutOffCountry ? ' active' : '')
                    }
                  >
                    Out Of Country
                  </div>
                </div>
                <Collapse isOpen={this.state.IsVisibleNewCourse}>
                  <div className="card mt-2 mb-4">
                    <div className="card-body">
                      <div className="row">
                        <div className="form-group col-12 col-sm-6 col-lg-5">
                          <label htmlFor="Branch">Branch:</label>
                          <div className="form-select">
                            <select
                              className="form-control"
                              type="select"
                              name="BranchId"
                              id="BranchId"
                              onChange={this.onBranchChangeHandler}
                            >
                              {this.props.user.userBranches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                  {branch.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-12 col-sm-6 col-lg-5">
                          <label htmlFor="Branch">Course:</label>
                          <div className="form-select">
                            <select
                              className="form-control"
                              type="select"
                              name="SessionId"
                              id="SessionId"
                              onChange={this.onChangeHandler}
                              value={this.state.SessionId}
                            >
                              {this.state.Sessions.map((session) => (
                                <option key={session.id} value={session.id}>
                                  {session.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group col-12 col-sm-6 col-lg-2">
                          <button
                            onClick={() => this.AddCourse()}
                            className="btn btn-primary label-space"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Collapse>

                <Collapse isOpen={this.state.IsVisibleTimeOff}>
                  <div className="card mt-2 mb-4">
                    <div className="card-body">
                      <div className="row">
                        <div className="form-group col-12 col-sm-3 col-lg-3">
                          <label htmlFor="exampleDate">StartDate:</label>
                          <div className="form-select">
                            <DatePicker
                              className="form-control"
                              selected={this.state.timeoffstartdate}
                              onChange={this.timeoffstartdatehandleChange}
                            />
                          </div>
                        </div>
                        <div className="form-group col-12 col-sm-3 col-lg-3">
                          <label htmlFor="exampleDate">End Date:</label>
                          <div className="form-select">
                            <DatePicker
                              className="form-control"
                              selected={this.state.timeoffenddate}
                              onChange={this.timeoffenddatehandleChange}
                            />
                          </div>
                        </div>
                        <div className="form-group col-12 col-sm-3 col-lg-3">
                          <label htmlFor="TimeOffNote">Note:</label>
                          <textarea
                            className="form-control"
                            value={this.state.TimeOffNote}
                            name="TimeOffNote"
                            id="TimeOffNote"
                            onChange={this.onChangeHandler}
                          />
                        </div>
                        <div className="form-group col-12 col-sm-6 col-lg-2">
                          <button
                            onClick={() => this.AddTimeOff()}
                            className="btn btn-primary label-space"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Collapse>
                <Collapse isOpen={this.state.IsVisibleOutOffCountry}>
                  <div className="card mt-2 mb-4">
                    <div className="card-body">
                      <div className="row">
                        <div className="form-group col-12 col-sm-3 col-lg-3">
                          <label htmlFor="exampleDate">StartDate:</label>
                          <div className="form-select">
                            <DatePicker
                              className="form-control"
                              selected={this.state.outofcountrystartdate}
                              onChange={this.outofcountrystartdatehandleChange}
                            />
                          </div>
                        </div>
                        <div className="form-group col-12 col-sm-3 col-lg-3">
                          <label htmlFor="exampleDate">End Date:</label>
                          <div className="form-select">
                            <DatePicker
                              className="form-control"
                              selected={this.state.outofcountryenddate}
                              onChange={this.outofcountryenddatehandleChange}
                            />
                          </div>
                        </div>
                        <div className="form-group col-12 col-sm-3 col-lg-3">
                          <label htmlFor="TimeOffNote">Note:</label>
                          <textarea
                            className="form-control"
                            value={this.state.OutOfCountryNote}
                            name="OutOfCountryNote"
                            id="OutOfCountryNote"
                            onChange={this.onChangeHandler}
                          />
                        </div>
                        <div className="form-group col-12 col-sm-6 col-lg-2">
                          <button
                            onClick={() => this.AddOutOffCountry()}
                            className="btn btn-primary label-space"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Collapse>
                <div className="studenttable-card mt-2 table-wrapper">
                  <div className="table table-responsive" id="studenttable">
                    <div className="ttop">
                      <div className="thead">
                        <div className="tr">
                          <div className="th">Course</div>
                          <div className="th">Start Date End Date</div>
                          <div className="th">Early Leaving Date</div>
                          <div className="th">Teacher Class</div>
                          <div className="th">Assessment Grade</div>
                          {/* <div className="th">Participation Grade</div> */}
                          {/* <div className="th">Total Grade</div> */}
                          <div className="th">Comment</div>
                          <div className="th">Conditional Pass</div>
                          <div className="th">Incomplete</div>
                          {/* <div className="div">Attendance Probation</div> */}
                          <div className="th">Academic Warning</div>
                          <div className="th">Behavioral Warning</div>
                          <div className="th"></div>
                        </div>
                      </div>
                      <div className="tbody">
                        {this.state.CourseView.map((courseview) => (
                          <div className="tr" key={courseview.Order}>
                            <div className="td">{courseview.Course}</div>
                            <div className="td">
                              {courseview.StartDate} {courseview.EndDate}
                            </div>
                            <div className="td">
                              {courseview.Course !== 'TimeOff' &&
                              courseview.Course !== 'Out Of Country' ? (
                                <div className="form-select">
                                  <DatePicker
                                    className="form-control"
                                    selected={
                                      courseview.EarlyLeavingDate ===
                                      '0001-01-01T00:00:00'
                                        ? new Date()
                                        : new Date(courseview.EarlyLeavingDate)
                                    }
                                    onChange={(e) => {
                                      this.earlyleavingdatechange(
                                        e,
                                        courseview.Id
                                      );
                                    }}
                                  />
                                </div>
                              ) : null}
                            </div>
                            <div className="td">
                              {courseview.Teacher} - {courseview.Class}
                            </div>

                            <div className="td">
                              {courseview.AssessmentGrade}
                            </div>
                            {/* <div className="td"></div> */}
                            {/* <div className="td"></div> */}
                            <div className="td">{courseview.Comment}</div>
                            <div className="td">
                              {courseview.Course !== 'TimeOff' &&
                              courseview.Course !== 'Out Of Country' ? (
                                <label className="form-csCheck remember-me">
                                  <input
                                    className="form-check-input form-control validate"
                                    checked={courseview.ConditionalPass}
                                    type="checkbox"
                                    onChange={() =>
                                      this.ConditionalPassChange(courseview.Id)
                                    }
                                  />
                                  <span className="form-csCheck-checkmark"></span>
                                </label>
                              ) : null}
                            </div>
                            <div className="td">
                              {courseview.Course !== 'TimeOff' &&
                              courseview.Course !== 'Out Of Country' ? (
                                <label className="form-csCheck remember-me">
                                  <input
                                    className="form-check-input form-control validate"
                                    checked={courseview.Incomplete}
                                    type="checkbox"
                                    onChange={() =>
                                      this.IncompleteChange(courseview.Id)
                                    }
                                  />
                                  <span className="form-csCheck-checkmark"></span>
                                </label>
                              ) : null}
                            </div>
                            {/* <div className="Td"></div> */}
                            <div className="td">
                              {courseview.Course !== 'TimeOff' &&
                              courseview.Course !== 'Out Of Country' ? (
                                <div className="form-select">
                                  <select
                                    name="AcademicWarning"
                                    id="AcademicWarning"
                                    onChange={(e) => {
                                      this.onAcademicWarningChange(
                                        e,
                                        courseview.Id
                                      );
                                    }}
                                    className="form-control"
                                    value={courseview.AcademicWarning}
                                  >
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                  </select>
                                </div>
                              ) : null}
                            </div>
                            <div className="td">
                              {courseview.Course !== 'TimeOff' &&
                              courseview.Course !== 'Out Of Country' ? (
                                <div className="form-select">
                                  <select
                                    name="BehavioralWarning"
                                    id="BehavioralWarning"
                                    onChange={(e) => {
                                      this.onBehavioralWarningChange(
                                        e,
                                        courseview.Id
                                      );
                                    }}
                                    className="form-control"
                                    value={courseview.BehavioralWarning}
                                  >
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                  </select>
                                </div>
                              ) : null}
                            </div>
                            <div className="td">
                              <a
                                className="btn text-danger"
                                onClick={() => this.deletecourse(courseview)}
                              >
                                Delete
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tabId="3">
                {this.state.CourseView.map((course, index) =>
                  course.Course !== 'TimeOff' &&
                  course.Course !== 'Out Of Country' ? (
                    <div
                      key={course.Order}
                      className="accordion mb-2"
                      id={course.Order}
                    >
                      <div className="card">
                        <div className="card-header" id="headingOne">
                          <div className="row">
                            <div className="col-12 col-md-9">
                              <a
                                className="btn pl-0 text-default"
                                type="button"
                                onClick={() => this.ActiveSet(index)}
                              >
                                {course.Course} ({course.StartDate}-
                                {course.EndDate})
                              </a>
                            </div>
                            <div className="col-12 col-md-3 text-md-right">
                              <a
                                className="btn d-flex aling-items-center justify-content-end pr-0"
                                onClick={() =>
                                  this.setState({
                                    invoiceaddmodal: true,
                                    addinvoicesessionid: course.SessionId,
                                  })
                                }
                              >
                                <i className="ri-add-line"></i> Add Invoice
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className={this.acordionactiveclass(index)}>
                          <div className="card-body">
                            {this.state.Invoices.map((invoice) =>
                              parseInt(course.SessionId) ===
                              parseInt(invoice.sessionId) ? (
                                <div
                                  key={invoice.id}
                                  className="accordion mb-2"
                                  id={invoice.id}
                                >
                                  <div className="card">
                                    <div
                                      className="card-header"
                                      id="headingOne"
                                    >
                                      <div className="row col-12">
                                        <div className="col-3 mt-2">
                                          <h6>
                                            Payment Type:
                                            {invoice.paymentTypeName}
                                          </h6>
                                        </div>
                                        <div className="col-2 mt-2">
                                          <h6>
                                            Date:{' '}
                                            {moment(invoice.date).format(
                                              'MM/DD/YYYY'
                                            )}
                                          </h6>
                                        </div>
                                        <div className="col-2 mt-2 ">
                                          <h6>Amount:{invoice.amount}</h6>
                                        </div>
                                        <div className="col-3">
                                          <h6>
                                            <a
                                              className="btn"
                                              onClick={() =>
                                                this.setState({
                                                  paymentmodal: true,
                                                  paymentaddedinvoiceid: parseInt(
                                                    invoice.id
                                                  ),
                                                })
                                              }
                                            >
                                              Add Payment
                                            </a>
                                          </h6>
                                        </div>
                                        {invoice.paymentTypeName ===
                                        'Tuttion Fee' ? (
                                          <div className="col-2"></div>
                                        ) : (
                                          <div className="col-2">
                                            <a
                                              className="btn text-danger"
                                              onClick={() =>
                                                this.invoicedelete(invoice.id)
                                              }
                                            >
                                              Delete
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div
                                      className={this.acordionactiveclass(
                                        index
                                      )}
                                    >
                                      <div className="card-body">
                                        <div className="table-wrapper">
                                          <div className="table table-responsive">
                                            <div className="ttop">
                                              <div className="thead">
                                                <div className="tr">
                                                  <div className="td">
                                                    Payment Method
                                                  </div>
                                                  <div className="td">Date</div>
                                                  <div className="td">
                                                    Amount
                                                  </div>
                                                  <div className="td">
                                                    Description
                                                  </div>
                                                  <div className="td"></div>
                                                </div>
                                              </div>
                                              <div className="tbody">
                                                {this.state.Payments.map(
                                                  (payment) =>
                                                    parseInt(
                                                      payment.invoiceId
                                                    ) ===
                                                      parseInt(invoice.id) &&
                                                    payment.status === true ? (
                                                      <div
                                                        className="tr"
                                                        key={payment.id}
                                                      >
                                                        <div className="td">
                                                          {
                                                            payment.paymentMethodName
                                                          }
                                                        </div>
                                                        <div className="td">
                                                          {payment.date}
                                                        </div>
                                                        <div
                                                          className={
                                                            payment.isPayment
                                                              ? 'paymentin td'
                                                              : 'paymentout td'
                                                          }
                                                        >
                                                          {payment.isPayment
                                                            ? '+'
                                                            : '-'}{' '}
                                                          {payment.amount}
                                                        </div>
                                                        <div className="td">
                                                          <p>
                                                            {
                                                              payment.description
                                                            }
                                                          </p>
                                                        </div>
                                                        <div className="td">
                                                          <a
                                                            className="btn text-danger"
                                                            onClick={() =>
                                                              this.paymentdelete(
                                                                payment.id
                                                              )
                                                            }
                                                          >
                                                            Delete
                                                          </a>
                                                        </div>
                                                      </div>
                                                    ) : null
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="mt-3">
                                          <b>
                                            Debt:
                                            {this.gettotal(
                                              invoice.amount,
                                              invoice.id
                                            )}
                                          </b>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </TabPane>
              <TabPane tabId="4">
                <StudentAttendance userid={history.location.state.id} />
              </TabPane>
              <TabPane tabId="5"></TabPane>
              <TabPane tabId="6">
                <form onSubmit={this.SaveFile}>
                  <div className="row">
                    <div className="form-group col-4 col-sm-4 col-lg-3">
                      <label htmlFor="StudentId">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="FileName"
                        id="FileName"
                        value={this.state.FileName}
                        onChange={this.onChangeHandler}
                      />
                    </div>
                    <div className="form-group col-12 col-sm-6 col-lg-3">
                      <label htmlFor="FileTypeId">FileType:</label>
                      <div className="form-select">
                        <select
                          className="form-control"
                          type="select"
                          name="FileTypeId"
                          id="FileTypeId"
                          value={this.state.FileTypeId}
                          onChange={this.onChangeHandler}
                        >
                          {this.state.FileTypes.map((filetype) => (
                            <option key={filetype.id} value={filetype.id}>
                              {filetype.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group col-12 col-sm-6 col-lg-3">
                      <label>File:</label>
                      <input type="file" onChange={this.handleFile} />
                    </div>
                    <div className="form-group col-12 col-sm-6 col-lg-2">
                      <Button
                        color="primary"
                        className="label-space"
                        type="submit"
                        disabled={this.state.FileLoading}
                      >
                        {this.state.FileLoading && (
                          <i className="ri-loader-4-line ri-spin"></i>
                        )}
                        {!this.state.FileLoading && 'File Save'}
                        {this.state.FileLoading && <span> Wait ...</span>}
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="table-wrapper">
                  <div className="table reponsive-table">
                    <div className="ttop">
                      <div className="thead">
                        <div className="tr">
                          <div className="td">Name</div>
                          <div className="td">File Type</div>
                          <div className="td"></div>
                        </div>
                      </div>
                      <div className="tbody">
                        {this.state.UserFiles.map((userfile) => (
                          <div className="tr" key={userfile.id}>
                            <div className="td">
                              <a target="blank" href={userfile.locationUrl}>
                                {userfile.name}
                              </a>
                            </div>
                            <div className="td">
                              {userfile.studentFilesType}
                            </div>
                            <div className="td">
                              <a
                                disabled={this.state.FileLoading}
                                onClick={() => this.fileDelete(userfile)}
                                className="btn text-danger"
                              >
                                {this.state.FileLoading && (
                                  <i className="ri-loader-4-line ri-spin"></i>
                                )}
                                {!this.state.FileLoading && 'Delete'}
                                {this.state.FileLoading && (
                                  <span> Wait ...</span>
                                )}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tabId="7"></TabPane>
            </TabContent>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { token: state.authReducer };
}
export default connect(mapStateToProps)(AddStudent);
