import React, { Component } from 'react';

import { BrowserRouter as Router, Route} from "react-router-dom";

import Header from './header';
import ItemList from './ItemList';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';

class App extends Component {
  

  render() {
    return (
      <Router>
        <div className="App">
          <CssBaseline />
          <Header />
          <Route path="/" exact
            component={Home} />
          <Route path="/:parentId" exact
            component={Item} />
          <Route path="/search/:searchQuery" exact
            component={SearchItem} />
        </div>
      </Router>
    );
  }
}

function SearchItem({ match }) {
  console.log('will render items based on search query.');
  return (
    <ItemList searchQuery={match.params.searchQuery} />
  );
}

function Item({ match }) {
  console.log('will render items based on parent.');
  return (
    <ItemList parentId={match.params.parentId} />
  );
}

function Home() {
  console.log('will render an item home.');
  return (
    <ItemList />
  );
}

export default App;
