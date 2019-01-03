import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

import './App.css';

import styled from 'styled-components';

import Item from './item';
import AddItemDialog from './addItem';

import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import HttpService from './services/http-service';
import NotificationService, { NOTIF_ITEM_ADDED, NOTIF_ITEM_CHANGED } from './services/notification-service';
//import DataService from './services/data-service';

let http = new HttpService();
let ns = new NotificationService();
//let ds = new DataService();

const StyledFab = styled(Fab) `
  margin: 20px;
  flex-justify:
`;

class ItemList extends Component {

  constructor(props) {
    super(props);

    this.loadHomes = this.loadHomes.bind(this);
    this.loadItems = this.loadItems.bind(this);
    this.searchItems = this.searchItems.bind(this);
    this.itemsList = this.itemsList.bind(this);
    this.goBack = this.goBack.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.handleDialogClickOpen = this.handleDialogClickOpen.bind(this);
    this.itemChanged = this.itemChanged.bind(this);

    this.breadcrumb = this.breadcrumb.bind(this);
    //this.handleDialogClose = this.handleDialogClose.bind(this);
    
    this.state = {
      items: [], 
      parent: this.props.parentId,
      fullPath: [],
      fullPathItems: [],
      searchQuery: this.props.searchQuery || '',
      dialogOpen: false
    };

    if (this.state.searchQuery !== '') {
      this.searchItems(props.searchQuery);
    } else {
      this.loadItems(this.props.parentId);
    }
    //this.loadHomes();
  }

  componentDidMount() {
    ns.addObserver(NOTIF_ITEM_ADDED, this, this.itemAdded);
    ns.addObserver(NOTIF_ITEM_CHANGED, this, this.itemChanged);
  }

  componentWillUnmount() {
    ns.removeObserver(NOTIF_ITEM_ADDED, this);
    ns.removeObserver(NOTIF_ITEM_CHANGED, this);
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      dialogOpen: false,
      parent: props.parentId,
      searchQuery: props.searchQuery || ''
    });
    if (props.searchQuery && props.searchQuery !== '') {
      this.searchItems(props.searchQuery);
    } else if (props.parentId) {
      this.loadItems(props.parentId);
    } else {
      this.loadHomes();
    }
  }

  loadHomes = () => {
    let self = this;
    http.getHomes().then(data => {
      self.setState({
        items: data.items,
        fullPath: data.parentPath
      });
    }, err => {
      console.log(err);
    });
  }

  loadItems = (parentId) => {
    let self = this;
    http.getItems(parentId).then(data => {
      self.setState({
        items: data.items,
        fullPath: data.parentPath || [],
        fullPathItems: data.pathItems
      });
    }, err => {
      console.log(err);
    });
  }

  searchItems = (searchQuery) => {
    let self = this;
    console.log('Searching for: '+searchQuery);
    http.searchItems(searchQuery).then(data  => {
      self.setState({
        items: data,
        fullPath: [],
        fullPathItems: []
      });
    }, err => {
      console.log(err);
    });
  }

  goBack = () => {
    let self = this;
    self.setState({dialogOpen: false})
    if (self.state.searchQuery !== '') {
      this.props.history.push('/');
    } else {
      http.getParentsParent(self.state.parent).then(data => {
        this.props.history.push('/'+ (data[0].parent || ''));
        //self.setState({items: data, parent: data[0].parent});
      }, err => {
        console.log(err);
      });
    }
  }

  itemAdded = (newItem) => {
    this.setState({items: this.state.items.concat(newItem), dialogOpen: false});
  }

  itemChanged = (changedItem) => {
    let items = this.state.items;
    let changedItemIndex = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id === changedItem._id) {
        changedItemIndex = i;
        break;
      }
    }
    if (changedItemIndex >= 0) {
      items[changedItemIndex] = changedItem;
    }
    this.setState({items: items});
  }

  deleteItem = (itemId) => {
    let self = this;
    let data = {
      id: itemId
    }
    http.removeItem(data).then(data => {
      console.log(data);
      self.loadItems(this.state.parent);
    }, err => {
      console.log(err);
    });
  }

  itemsList = () => {
    if (this.state.items) {
      const list = this.state.items.map(item => 
        <Grid item l={2} md={3} s={6} key={item._id}>
          <Item data={item} deleteAction={() => this.deleteItem(item._id)} saveEditAction={() => this.saveItemEdit}></Item>
        </Grid>
      );
      return list;
    }
  }

  breadcrumb = () => {
    if (this.state.fullPathItems) {
      const crumb = this.state.fullPathItems.map((item) => {
        if (item._id === this.state.parent) {
          return (
            <Grid item key={item._id}>
              <Button size="small" color="secondary">
                {item.name}
              </Button>
            </Grid>
          )
        } else {
          return (
            <Grid item key={item._id}>
              <Button size="small" component={Link} to={'/'+item._id}>
                {item.name}
              </Button> >
            </Grid>
          )
        }
      }
        
      );
      return crumb;
    }
  }

  handleDialogClickOpen = () => {
    this.setState({dialogOpen: true});
  }

  render () {
    return (
      <div className='pageContent'>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item md={11}>
                <Grid container direction="row" spacing={8} justify="flex-start">
                  <Grid item>
                    <Button size="small" component={Link} to={'/'}>
                      Houses
                    </Button> >
                  </Grid>
                  {this.breadcrumb()}
                </Grid>
              </Grid>
              <Grid item md={1}>
                <StyledFab color="secondary" aria-label="Add" onClick={() => this.handleDialogClickOpen()} disabled={this.state.searchQuery !== ''}>
                  <Icon>add_icon</Icon>
                </StyledFab>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row" spacing={24}>
              {this.itemsList()}
            </Grid>
          </Grid>
          <AddItemDialog parent={this.state.parent} fullPath={this.state.fullPath} dialogOpen={this.state.dialogOpen}></AddItemDialog>
        </Grid>

      </div>
      
    );
  }
}

export default withRouter(ItemList);