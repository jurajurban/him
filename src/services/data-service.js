//import NotificationService, { NOTIF_WISHLIST_CHANGED } from './notification-service';
import HttpService from './http-service';

let instance = null;

//let ns = new NotificationService();
let http = new HttpService();

var items = [];
var parent = null;

class DataService {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  loadItems = () => {
    http.getItems(parent).then(data => {
      items = data;
      console.log(items);
      return items;
    }, err => {
      console.log(err);
      return [];
    });
  }

  setParent = parentId => {
    parent = parentId;
  }

  /*addWishListItem = item => {
    var self = this;
    http.addProductToWishlist(item).then(data => {
      self.loadWishlist();
    }, err => {
      console.log(err);
    }).catch(err => {
      console.log(err);
    });
  }

  removeWishListItem = item => {
    var self = this;
    http.removeProductFromWishList(item).then(data => {
      self.loadWishlist();
    }, err => {
      console.log(err);
    })
  }

  itemOnWishlist = item => {
    for (var x = 0; x < wishList.length; x++ ){
      if (wishList[x]._id === item._id) {
        return true
      }
    }
    return false;
  }*/

}

export default DataService;