export const NOTIF_ITEM_ADDED = 'notif_item_added';
export const NOTIF_ITEM_CHANGED = 'notif_item_changed';

let instance = null;

var observers = {};

class NotificationService {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  postNotification = (notifName, data) => {
    let obs = observers[notifName];

    if (obs) {
      for (var x = 0; x < obs.length; x++) {
        var obj = obs[x];

        obj.callBack(data);
      }
    }
  }

  addObserver = (notifName, observer, callBack) => {
    let obs = observers[notifName];

    if (!obs) {
      observers[notifName] = [];
    }

    let obj = {observer: observer, callBack: callBack};

    observers[notifName].push(obj);
  }

  removeObserver = (notifName, observer) => {
    let obs = observers[notifName];

    if (obs) {
      for (var x = 0; x < obs.length; x++ ) {
        if (obs[x].observer === observer) {
          observers[notifName].splice(x, 1);
          break;
        }
      }
    }
  }
}

export default NotificationService;