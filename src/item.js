import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { withRouter } from 'react-router-dom';

import { QRCode } from 'react-qr-svg';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextField from '@material-ui/core/TextField';

import HttpService from './services/http-service';
import NotificationService, { NOTIF_ITEM_CHANGED } from './services/notification-service';

let http = new HttpService();
let ns = new NotificationService();

class Item extends Component {
  constructor(props) {
    super(props);
    this.goToContent = this.goToContent.bind(this);
    this.itemType = this.itemType.bind(this);
    this.tags = this.tags.bind(this);
    this.qrCode = this.qrCode.bind(this);
    this.initiateEdit = this.initiateEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.nonEditActions = this.nonEditActions.bind(this);
    this.editActions = this.editActions.bind(this);
    this.saveItemEdit = this.saveItemEdit.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.deleteItem = this.deleteItem.bind(this);

    this.state = {
      editing: false,
      data: this.props.data,
      confirmDeleteDialogOpen: false
    }
  }

  qrCode = () => {
    const input = document.getElementById(this.props.data._id);
    input.style.display = "flex";
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        input.style.display = "none";
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save(this.props.data.name+".pdf");  
      });
    ;
  }

  goToContent = () => {
    this.props.history.push('/'+this.props.data._id);
  }

  itemType = () => {
    return (
      <div>{this.props.data.type}</div>
    )
  }

  initiateEdit = () => {
    this.setState({editing: true});
  }

  cancelEdit = () => {
    this.setState({
      editing: false,
      data: this.props.data
    });
  }

  saveItemEdit = () => {
    this.setState({
      editing: false
    });
    http.updateItem(this.state.data).then(data => {
      ns.postNotification(NOTIF_ITEM_CHANGED, data);
    }, err => {
      console.log(err);
    });
  }

  handleChange = (event) => {
    let data = this.state.data;
    data[event.target.name] = event.target.value;
    this.setState({ data: data});
  }

  openDialog = () => {
    this.setState({confirmDeleteDialogOpen: true});
  }

  handleCloseDialog = () => {
    this.setState({confirmDeleteDialogOpen: false});
  }

  deleteItem = () => {
    this.setState({confirmDeleteDialogOpen: false});
    this.props.deleteAction();
  }

  tags = () => {
    const tags = this.props.data.tags.map(tag =>
      <Chip variant="outlined" label={tag} />
    );
    return tags;
  }

  nonEditActions = () => {
    return (
      <Grid container spacing={8} alignItems="center">
        <Grid item>
          <Tooltip title="Content">
            <IconButton aria-label="Content" disabled={this.props.data.type === 'item' ? true : false} onClick={() => this.goToContent()}>
              <Icon>ballot_icon</Icon>
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs></Grid>
        <Grid item>
          <Tooltip title="Edit">
            <IconButton aria-label="Edit" onClick={() => this.initiateEdit()}>
              <Icon>edit_icon</Icon>
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="QR Code">
            <IconButton aria-label="QR Code" onClick={() => this.qrCode()}>
              <Icon>print_icon</Icon>
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" onClick={() => this.openDialog()}>
              <Icon>delete_icon</Icon>
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }

  editActions = () => {

    return (
      <Grid container spacing={8} alignItems="center">
        <Grid item>
          <Tooltip title="Cancel">
            <IconButton aria-label="Cancel" color="secondary" onClick={() => this.cancelEdit()}>
              <Icon>cancel_icon</Icon>
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs></Grid>
        <Grid item>
          <Tooltip title="Save">
            <IconButton aria-label="Save" color="secondary" onClick={() => this.saveItemEdit()}>
              <Icon>save_icon</Icon>
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }

  nonEditData = () => {
    return (
      <CardContent>
        <Typography variant="overline">{this.props.data.type}</Typography>
        <Typography variant="h5">{this.props.data.name}</Typography>
        <Typography component="p" gutterBottom>{this.props.data.description}</Typography>
        {this.tags()}
      </CardContent>
    );
  }

  editData = () => {
    return (
      <CardContent>
        <Typography variant="overline">{this.props.data.type}</Typography>
        <TextField
          value={this.state.data.name}
          onChange={this.handleChange}
          margin="dense"
          id="name"
          name="name"
          type="text"
          fullWidth
        />
        <TextField
          value={this.state.data.description}
          onChange={this.handleChange}
          multiline
          name="description"
          rowsMax="4"
          id="description"
          type="text"
          fullWidth
        />
        {this.tags()}
      </CardContent>
    );
  }

  render () {
    return (
      <Card>
        {this.state.editing ? this.editData() : this.nonEditData()}
        <CardActions>
          {this.state.editing ? this.editActions() : this.nonEditActions()}
        </CardActions>
        <div id={this.props.data._id} className="qr-code-div">
          <div className="qr-code-text">
            <Typography variant="h6">
              {this.props.data.name}
            </Typography>
            <Typography variant="body2">
              {this.props.data.description}
            </Typography>
          </div>
          <div className="qr-code-image">
            <QRCode value={'http://localhost:3004/'+this.props.data._id} level="Q" style={{widht: 100}} />
          </div>
        </div>
        <Dialog
          open={this.state.confirmDeleteDialogOpen}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>Delete Item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteItem} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  }
}

export default withRouter(Item);