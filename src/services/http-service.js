import 'whatwg-fetch';

let instance = null;
const serviceLocation = 'http://localhost:3004';

class HttpService {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  getHomes = () => {
    var promise = new Promise((resolve, reject) => {

      fetch(serviceLocation+'/homes')
      .then(res => {
        resolve(res.json());
      });
    });
    return promise;
  }
  
  getItems = (parentId) => {
    var promise = new Promise((resolve, reject) => {

      fetch(serviceLocation+'/items' + (parentId ? '?parent='+parentId : '') )
      .then(res => {
        resolve(res.json());
      });
    });
    return promise;
  }

  searchItems = (searchQuery) => {
    var promise = new Promise((resolve, reject) => {
      fetch(serviceLocation+'/search?searchQuery='+searchQuery )
      .then(res => {
        resolve(res.json());
      });
    });
    return promise;
  }

  getParentsParent = (parentId) => {
    var promise = new Promise((resolve, reject) => {
      if (parentId) {
        fetch(serviceLocation+'/parentItems?parent='+parentId)
        .then(res => {
          resolve(res.json());
        });
      } else {
        fetch(serviceLocation+'/items')
        .then(res => {
          resolve(res.json());
        });
      }
    });
    return promise;
  }

  getFullPathItems = (fullPathIds) => {
    var promise = new Promise((resolve, reject) => {
      var request  = 'id='+fullPathIds.join('&id=');
      fetch(serviceLocation+'/parentPath?'+request)
      .then(res => {
        resolve(res.json());
      });
    });
    return promise;
  }

  addItem = (data) => {
    console.log(JSON.stringify(data));
    var promise = new Promise((resolve, reject) => {
      fetch(serviceLocation+'/item', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
      })
      .then(res => {
        resolve(res.json());
      });
    });
    return promise;
  }

  updateItem = (data) => {
    console.log(JSON.stringify(data));
    var promise = new Promise((resolve, reject) => {
      fetch(serviceLocation+'/item', {
        method: 'PUT',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
      })
      .then(res => {
        resolve(res.json());
      });
    });
    return promise;
  }

  removeItem = (data) => {
    var promise = new Promise((resolve, reject) => {
      fetch(serviceLocation+'/item/remove',
      {
        method: 'DELETE',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)     
      })
      .then(res => {
        resolve(res.json());
      }, err => {
        console.log(err);
      })
    });
    return promise;
  }
}

export default HttpService;