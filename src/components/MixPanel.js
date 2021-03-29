
var mixpanel = require('mixpanel-browser');

mixpanel.init("b9d494c5a0a88ad6ec61656236a561ae");

let env_check = process.env.NODE_ENV === 'production' || 
process.env.NODE_ENV === 'development';

let actions = {
    identify: (id) => {
      if (env_check) mixpanel.identify(id);
    },
    alias: (id) => {
      if (env_check) mixpanel.alias(id);
    },
    track: (name, props) => {
      if (env_check) mixpanel.track(name, props);
    },
    people: {
      set: (props) => {
        if (env_check) mixpanel.people.set(props);
      },
    },
  };
  
  export let MixPanel = actions;