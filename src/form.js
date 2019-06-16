import React from 'react';
import { connect } from 'react-redux'

import { CountryDropdown } from 'react-country-region-selector';
import IntlTelInput from 'react-bootstrap-intl-tel-input'
import moment from 'moment';
class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        title: 'Mr',
        firstname: '',
        lastname: '',
        birthday: '',
        nationality: 'Thailand',
        citizenId: '',
        gender: 'male',
        phone: '+66 555555555',
        passport: '',
        exSalary: ''
      },
      ids: ['','','','',''],
      alert: {}
    }
  }
  handleChange = (e) => {
    let value = e.target.value
    this.setState({
      user: {
        ...this.state.user,
        [e.target.name]: value
      } 
    })
  }
  handleKeyPress = (e) => {
    var ch = String.fromCharCode(e.which)
    if (!(/[0-9]/.test(ch))) {
      e.preventDefault();
    }
  }
  handleCountry = (data)=> {
    this.setState({
      user: {
        ...this.state.user,
        nationality: data
      }
    })
  }
  handleCitizen = (e) => {
    let ar = [1,4,5,2,1]
    let index = parseInt(e.target.id.split('_')[1])
    let value = e.target.value
    let tmp = this.state.ids
    tmp[index - 1] = value
    this.setState((state, prop) => ({
      ids: tmp,
      user: {
        ...this.state.user,
        citizenId: tmp[0] + tmp[1] + tmp[2] + tmp[3] + tmp[4]
      }
    }))
    if (value.length === ar[index - 1] && index !== 5)
      document.getElementById("citizen_" + (index + 1)).focus();
  }
  handlePhone = (data) => {
    console.log(data)
    this.setState((state, prop) => ({
      user: {
        ...this.state.user,
        phone: data.intlPhoneNumber
      }
    }))
  }
  validate = (e) => {
    let alert = {...this.state.alert}
    let value = e.target.value
    switch (e.target.name) {
      case 'passport': 
        if (value.length < 8 && value.length > 0) 
          alert['passport'] = 'Please fill correct passport No, 8 length.'
        else delete alert.passport
        break;
      case 'firstname':
        if (value.length === 0)
          alert['firstname'] = 'Please fill firstname'
        else delete alert.firstname
        break;
      case 'lastname':
        if (value.length === 0)
          alert['lastname'] = 'Please fill lastname'
        else delete alert.lastname
        break;
      case 'exSalary':
          if (value.length === 0)
            alert['exSalary'] = 'Please fill expected salary.'
          else delete alert.exSalary
          break;
      default: 
    }
    this.setState((state, prop) => ({
      ...this.state,
      alert: alert
    }))
  }
  submit = (e) => {
    e.preventDefault();
    let alert = {...this.state.alert}
    let user = this.state.user
    if (user.citizenId.length < 13 && user.citizenId.length > 0)
      alert['citizenId'] = 'Please fill correct citizen ID, 13 length'
    else delete alert.citizenId
    if (user.firstname === '') alert['firstname'] = 'Please fill firstname'
    else delete alert.firstname
    if (user.lastname === '') alert['lastname'] = 'Please fill lastname'
    else delete alert.lastname
    if (user.exSalary === '') alert['exSalary'] = 'Please fill expected salary'
    else delete alert.exSalary
    if (user.birthday === '') alert['birthday'] = 'Please fill birthday'
    else delete alert.birthday
    if (user.phone.length < 5) alert['phone'] = 'Please fill phone number'
    else delete alert.phone
    console.log(alert === {})
    if (Object.getOwnPropertyNames(alert).length === 0) {
      if (this.props.editIndex !== null) {
        this.props.updateUser(this.state.user)
      }
      else this.props.addUser(this.state.user)
    }
    this.setState({
      ...this.state,
      alert: alert
    })
  }
  componentWillReceiveProps (nextProps) {
    console.log('ReceiveProps',nextProps.editIndex)
    let editIndex = nextProps.editIndex
    if (editIndex !== null && nextProps.editUser) {
      let citizenId = nextProps.editUser.citizenId
      let ids = [citizenId.substr(0,1), citizenId.substr(1,4), citizenId.substr(5,5),citizenId.substr(10,2),citizenId.substr(12,1)]
      this.setState({
        user: nextProps.editUser,
        ids: ids,
        alert: {}
      })
    }
    else {
      this.setState({
        ...this.state,
        user: {
          title: 'Mr',
          firstname: '',
          lastname: '',
          birthday: '',
          nationality: 'Thailand',
          citizenId: '',
          gender: 'male',
          phone: '+66 555555555',
          passport: '',
          exSalary: ''
        },
        ids: ['','','','','']
      })
    }
  }
  render() {
    let editIndex = this.props.editIndex
    let user = this.state.user
    return (
    <form>
      <div className="form-group row">
        <label htmlFor="staticEmail" className="col-sm-2 col-md-1 col-form-label">Title <span className="text-danger">*</span></label>
        <div className="col-sm-3 col-md-2">
        <select className="form-control" name="title" value={user.title} /* defaultValue={"Mr"} */ onChange={this.handleChange}>
          <option value="Mr">Mr</option>
          <option value="Ms">Ms</option>
        </select>
        </div>
        <label htmlFor="firstname" className="col-sm-2 col-md-1 col-form-label">Firstname<span className="text-danger">*</span></label>
        <div className="col-sm-5 col-md-3">
          <input type="text" className={(this.state.alert.firstname)?"form-control is-invalid":"form-control"} name="firstname" id="firstname" value={user.firstname} onChange={this.handleChange} onBlur={this.validate}/>
          <div className={(this.state.alert.firstname)?"invalid-feedback":""}>
            {this.state.alert.firstname}
          </div>
        </div>
        <label htmlFor="lastname" className="col-sm-2 col-md-1 col-form-label">Lastname<span className="text-danger">*</span></label>
        <div className="col-sm-10 col-md-3">
          <input type="text" className={(this.state.alert.lastname)?"form-control is-invalid":"form-control"} name="lastname" id="lastname" value={user.lastname} onChange={this.handleChange} onBlur={this.validate}/>
          <div className={(this.state.alert.lastname)?"invalid-feedback":""}>
            {this.state.alert.lastname}
          </div>
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="birthday" className="col-sm-2 col-md-1 col-form-label ">Birthday<span className="text-danger">*</span></label>
        <div className="col-sm-10 col-md-5">
          <input type="date" id="birthday" name="birthday"
          className={(this.state.alert.birthday)?"form-control is-invalid":"form-control"}
          value={user.birthday}
          onChange={this.handleChange}
          min="1919-01-01" max={moment().format('YYYY-MM-DD')}
          />
          <div className={(this.state.alert.birthday)?"invalid-feedback":""}>
            {this.state.alert.lastname}
          </div>
        </div>
        <label htmlFor="country" className="col-sm-2 col-md-1 col-form-label">Nationality</label>
        <div className="col-sm-10 col-md-5">
          <CountryDropdown
          showDefaultOption={false}
          className="form-control"
          name="nationality"
          value={user.nationality}
          onChange={this.handleCountry} />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="citizen" className="col-sm-2 col-md-1 col-form-label">Citizen ID</label>
        <div className="col-sm-1 col-md-1">
          <input type="text" className={(this.state.alert.citizenId)?"form-control is-invalid":"form-control"} id="citizen_1" value={this.state.ids[0]} onKeyPress={this.handleKeyPress} onChange={this.handleCitizen} maxLength="1" onBlur={this.validate}/>
        </div>-
        <div className="col-sm-2 col-md-2">
          <input type="text" className={(this.state.alert.citizenId)?"form-control is-invalid":"form-control"} id="citizen_2" value={this.state.ids[1]} onKeyPress={this.handleKeyPress} onChange={this.handleCitizen} maxLength="4"/>
        </div>-
        <div className="col-sm-2 col-md-2">
          <input type="text" className={(this.state.alert.citizenId)?"form-control is-invalid":"form-control"} id="citizen_3" value={this.state.ids[2]} onKeyPress={this.handleKeyPress} onChange={this.handleCitizen} maxLength="5"/>
        </div>-
        <div className="col-sm-1 col-md-1">
          <input type="text" className={(this.state.alert.citizenId)?"form-control is-invalid":"form-control"} id="citizen_4" value={this.state.ids[3]} onKeyPress={this.handleKeyPress} onChange={this.handleCitizen} maxLength="2"/>
        </div>-
        <div className="col-sm-1 col-md-1">
          <input type="text" className={(this.state.alert.citizenId)?"form-control is-invalid":"form-control"} id="citizen_5" value={this.state.ids[4]} onKeyPress={this.handleKeyPress} onChange={this.handleCitizen} maxLength="1"/>
        </div>
        <div className={(this.state.alert.citizenId)?"text-danger":""}>
          <small>{this.state.alert.citizenId}</small>  
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="citizen" className="col-sm-2 col-md-1 col-form-label">Gender</label>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="gender" id="male" value="male" defaultChecked={user.gender ==="male"} onChange={this.handleChange}/>
          <label className="form-check-label" htmlFor="male">Male</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="gender" id="female" value="female" defaultChecked={user.gender ==="female"} onChange={this.handleChange}/>
          <label className="form-check-label" htmlFor="female">Female</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="gender" id="other" value="other" defaultChecked={user.gender ==="other"} onChange={this.handleChange}/>
          <label className="form-check-label" htmlFor="other">Other</label>
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="phone" className="col-sm-2 col-md-1 col-form-label">Mobile Phone<span className="text-danger">*</span></label>
        <div className="col-sm-10 col-md-10">
          <IntlTelInput
            preferredCountries={['US', 'TH']}
            efaultCountry={'TH'}
            defaultValue={this.props.editUser.phone || '+66 55555555'}
            onChange={(data) => this.handlePhone(data)}
            className={(this.state.alert.phone)?'is-invalid':''}
          />
          <div className={(this.state.alert.phone)?"invalid-feedback":""}>
            {this.state.alert.phone}
          </div>
          <p className="text-danger">
            <small>
              {this.state.alert.phone}
            </small>
          </p>
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="citizen" className="col-sm-2 col-md-1 col-form-label">Passport No</label>
        <div className="col-sm-6 col-md-6">
          <input type="text" className={(this.state.alert.passport)?'form-control is-invalid':'form-control'} name="passport" id="passport" value={user.passport} onKeyPress={this.handleKeyPress} onChange={this.handleChange} onBlur={this.validate} maxLength="8"/>
          <div className={(this.state.alert.passport)?"invalid-feedback":""}>
            {this.state.alert.passport}
          </div>
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="citizen" className="col-sm-2 col-md-1 col-form-label">Expected Salary <span className="text-danger">*</span></label>
        <div className="col-sm-6 col-md-6">
          <input type="number" className={(this.state.alert.exSalary)?"form-control is-invalid":"form-control"} name="exSalary" id="exSalary" value={user.exSalary} onChange={this.handleChange} onBlur={this.validate}/>
          <div className={(this.state.alert.exSalary)?"invalid-feedback":""}>
            {this.state.alert.exSalary}
          </div>
        </div>
        <br/>

        
      </div>
      <p>
        <small><span className="text-danger">{this.state.alert.require}</span></small>
      </p>
      <div className="form-group row">
        <button type="submit" className="btn btn-primary btn-lg" min="1000" onClick={this.submit}>{(editIndex !== null)?'Save':'Submit'}</button>
      </div>
    </form>
    )
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addUser: (user) => {
      dispatch({
        type: "ADD",
        payload: user
      });
    },
    updateUser: (user) => {
      dispatch({
        type: "UPDATE",
        payload: user
      });
    }
  }
}
const mapStateToProps = (state) => {
  return {
    editIndex: state.editIndex,
    editUser: state.editUser
  }
}
export default connect(mapStateToProps ,mapDispatchToProps)(Form)
