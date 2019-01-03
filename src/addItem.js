import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import HttpService from './services/http-service';
import NotificationService, { NOTIF_ITEM_ADDED } from './services/notification-service';
//import DataService from './services/data-service';

let http = new HttpService();
let ns = new NotificationService();

class AddItemDialog extends Component {

  constructor(props) {
    super(props);

    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.state = {
      dialogOpen: false,
      type: "",
      name: "",
      description: ""
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ dialogOpen: props.dialogOpen });
  }

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
      type: "",
      name: "",
      description: ""
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSave = () => {
    let fullPath = this.props.fullPath;;
    if (this.props.parent) {
      fullPath.push(this.props.parent);
    }
    console.log(fullPath);
    let data = {
      parent: this.props.parent,
      fullPath: fullPath,
      name: this.state.name,
      description: this.state.description,
      type: this.state.type
    }

    http.addItem(data).then(data => {
      ns.postNotification(NOTIF_ITEM_ADDED, data);
      this.handleDialogClose();
    }, err => {
      console.log(err);
    });
  }

  render () {
    return (
      
      <Dialog
      open={this.state.dialogOpen}
      onClose={this.handleDialogClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add Item</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add an item please fill all following fields.
        </DialogContentText>
        <form>
            <TextField
              value={this.state.name}
              onChange={this.handleChange}
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
            />
            <TextField
              value={this.state.description}
              onChange={this.handleChange}
              margin="dense"
              multiline
              name="description"
              rowsMax="4"
              id="description"
              label="Description"
              type="text"
              fullWidth
            />
          <FormControl
            fullWidth
            margin="dense">
            <InputLabel shrink htmlFor="type">
              Type
            </InputLabel>
            <Select
              value={this.state.type}
              onChange={this.handleChange}
              inputProps={{
                name: 'type',
                id: 'type',
              }}
            >
              <MenuItem value="item">Item</MenuItem>
              <MenuItem value="containter">Containter</MenuItem>
              <MenuItem value="room">Room</MenuItem>
              <MenuItem value="house">House</MenuItem>
            </Select>
          </FormControl>
        </form>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleDialogClose} color="primary">
          Cancel
        </Button>
        <Button onClick={this.handleSave} color="primary">
            Add Item
        </Button>
      </DialogActions>
    </Dialog>
    );
  }
}

export default AddItemDialog;