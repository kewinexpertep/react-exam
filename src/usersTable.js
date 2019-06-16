import React from 'react';
import { connect } from 'react-redux'

class UsersTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      checkeds: [],
      pageCurrent: 0
    }
  }
  handleCheckbox = (e) => {
    let index = parseInt(e.target.name.split('_')[1])
    if (e.target.checked) {
      let tmp = this.state.checkeds
      tmp.push(index)
      this.setState((state, props) => ({
        checkeds: tmp
      }))
    }
    else {
      let tmp = this.state.checkeds
      tmp.splice(tmp.indexOf(index),1)
      this.setState((state, props) => ({
        checkeds: tmp
      }))
    }
  }
  checkSelect = (index) => {
    var found = this.state.checkeds.find((element) => {
      return element === index;
    })
    if (found >= 0)
      return true
    else
      return false
  }
  handleCheckboxAll = (e) => {
    let checkeds = []
    if (e.target.checked) {
      for(let i=0; i < this.props.users.length; i++) {
        checkeds.push(i)
      }
    }
    this.setState({
      checkeds: checkeds
    })
  }
  deleteMulUser = (e) => {
    this.props.deleteMulUser(this.state.checkeds)
    this.setState({
      checkeds: []
    })
    document.getElementById("selectall").checked = false;
  }
  handleChangePage = (e) => {
    this.setState({
      ...this.state,
      pageCurrent: parseInt(e.target.name)
    })
  }
  pageStep = (e) => {
    let type = e.target.name
    switch (type) {
      case 'previous':
        this.setState((state, props) => ({
          ...this.state,
          pageCurrent: state.pageCurrent - 1
        }))
        break
      case 'next':
        this.setState((state, props) => ({
          ...this.state,
          pageCurrent: state.pageCurrent + 1
        }))
        break
      default:
    }
  }
  render() {
    let pageCurrent = this.state.pageCurrent
    let top = Math.ceil(this.props.users.length/5)
    let listUser = [];
    let pagination = [];
    if (0 === this.props.users.length) {
      listUser.push(
        <td className="text-center" colSpan="6">Nothing</td>
      )
    }
    for (let i = pageCurrent * 5; i < (pageCurrent + 1) * 5 && i < this.props.users.length; i++) {
      let user = this.props.users[i]
      listUser.push(<tr key={i}>
      <th scope="row"><input type="checkbox" name={'checkbox_' + i} id="" checked={this.checkSelect(i)} onChange={this.handleCheckbox}/></th>
      <td>{user.firstname + ' ' + user.lastname}</td>
      <td>{user.gender}</td>
      <td>{user.phone}</td>
      <td>{user.nationality}</td>
      <td className="text-center">
        <button type="button" className="btn btn-warning" onClick={() => this.props.editUser(i)}>edit</button>
        <button type="button" className="btn btn-danger ml-1 mt-1" onClick={() => {this.props.deleteUser(i);this.props.update();}}>delete</button>
      </td>
    </tr>)
    }
    if (0 === this.props.users.length) {
      pagination.push(
        <li className={"page-item active"}><a className="page-link">1</a></li>
      )
    }
    for (let i = 0; i < top; i++) {
      pagination.push(
        <li key={i} className={(pageCurrent === i)?"page-item active":"page-item"}><a className="page-link" name={i} onClick={this.handleChangePage}>{(i + 1)}</a></li>
      )
    }
    return (
      <div className="userTable mt-3">
        <div className="row">
          <div className="col-md-8">
            <input type="checkbox" id="selectall" onChange={this.handleCheckboxAll}/> 
            <label htmlFor="selectall" className="col-form-label mr-4">Select all</label> 
            <button type="button" className="btn btn-danger" onClick={this.deleteMulUser}>Delete</button>
          </div>
          <nav className="col-md-4 text-right">
            <ul className="pagination">
              <li className={(0 < pageCurrent)?"page-item":"page-item disabled"}>
                <a className="page-link" name="previous" onClick={this.pageStep}>Previous</a>
              </li>
              {pagination}
              <li className={(top-1 > pageCurrent)?"page-item":"page-item disabled"}>
                <a className="page-link" name="next" onClick={this.pageStep}>Next</a>
              </li>
            </ul>
          </nav>
        </div>
        <table className="table mt-3 border">
          <thead className="thead">
            <tr>
              <th scope="col"></th>
              <th scope="col">name</th>
              <th scope="col">Gender</th>
              <th scope="col">Mobile phone</th>
              <th scope="col">Nationality</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {listUser}
          </tbody>
        </table>
        
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    users: state.users,
    editIndex: state.editIndex,
    update: state.update
  }
}
const mapDispatchToProps = dispatch => {
  return {
    deleteUser: (index) => {
      dispatch({
        type: "DELETE",
        index: index
      });
    },
    deleteMulUser: (Selecteds) => {
      dispatch({
        type: "DELETEMUL",
        selecteds: Selecteds
      });
    },
    editUser: (index) => {
      dispatch({
        type: "EDIT",
        index: index
      });
    },
    update: (index) => {
      dispatch({
        type: "update",
        index: index
      });
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UsersTable)
