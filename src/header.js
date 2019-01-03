import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';

class Header extends Component {

  constructor(props) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);

    this.state = {searchQuery: ''};
  }

  changeHandler = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  submitHandler = (event) => {
    if (event.key === 'Enter') {
      if (this.state.searchQuery === '') {
        this.props.history.push('/');
      } else {
        this.props.history.push('/search/'+this.state.searchQuery);
      }
    }
  }

  render () {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Grid container spacing={24} justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6" color="inherit">
                  H.I.M.
                </Typography>
              </Grid>
              <Grid item>
                <div className="header-search-field">
                  <Grid container spacing={24} alignItems="center">
                    <Grid item>
                      <Icon>search_icon</Icon>
                    </Grid>
                    <Grid item>
                      <InputBase
                        placeholder="Search…"
                        name="search"
                        value={this.state.searchQuery}
                        onChange={this.changeHandler}
                        onKeyPress={this.submitHandler}
                      />
                    </Grid>
                  </Grid>

                </div>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(Header);