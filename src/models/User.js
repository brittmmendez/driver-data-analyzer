// MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types, flow, getParent } from 'mobx-state-tree';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const User = types
  .model({
    id: types.optional(types.number, 0),
    first_name: types.optional(types.string, ''),
    last_name: types.optional(types.string, ''),
    email: types.optional(types.string, ''),
    newUser: types.optional(types.boolean, false),
    registerError: types.optional(types.boolean, false),
    logInError: types.optional(types.boolean, false),
    loggedIn: types.optional(types.boolean, false),
    guestToken: types.optional(
      types.string,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcl9pZCI6MH0.VZCOAFwY_bppftzT0AFGWuPo2pF06inOP2GeQhkbamM'
    ),
    token: types.optional(types.string, '')
  })
  .actions(self => ({
    setEmail(email) {
      self.email = email;
    },

    getToken() {
      const token = self.loggedIn ? self.token : self.guestToken;

      return token;
    },

    logOut() {
      self.id = 0;
      self.first_name = '';
      self.last_name = '';
      self.email = '';
      self.loggedIn = false;
      self.token = '';
      cookies.remove('user');
      console.log(cookies);
      console.log('logged Out');

      if (getParent(self, 1).cart.id) {
        getParent(self, 1).cart.updateCartCustomer(0);
      }
    },

    signin: flow(function* signin(userInfo) {
      try {
        const response = yield window.fetch(
          `${getParent(self, 1).apiUrl}/login`,
          {
            method: 'POST',
            body: JSON.stringify({
              email: userInfo.email,
              password: userInfo.signinPassword
            }),
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        );
        if (response.status !== 200) {
          self.logInError = true;
          console.log(response);
          return false;
        }
        if (response.status === 200) {
          let result = response;
          result = yield result.json();
          self.id = result.customer.id;
          self.first_name = result.customer.first_name;
          self.last_name = result.customer.last_name;
          self.email = userInfo.email;
          self.token = result.token;
          self.logInError = false;
          self.loggedIn = true;
          if (getParent(self, 1).cart.itemCount > 0) {
            getParent(self, 1).cart.updateCartCustomer(result.id);
          }
          console.log('signed in');
          cookies.set(
            'user',
            { token: result.token, id: result.customer.id },
            { path: '/' }
          );
          console.log(cookies.get('user'));
          return true;
        }
      } catch (err) {
        self.logInError = true;
        console.log(err);
        return false;
      }
      self.logInError = false;
      return true;
    }),

    register: flow(function* register(userInfo) {
      try {
        const response = yield window.fetch(
          `${getParent(self, 1).apiUrl}/register`,
          {
            method: 'POST',
            body: JSON.stringify({
              first_name: userInfo.firstName,
              last_name: userInfo.lastName,
              email: userInfo.email,
              password: userInfo.password
            }),
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        );
        if (response.status !== 201) {
          const result = yield response.json();
          self.registerError = true;
          console.log(result);
          return false;
        }
        if (response.status === 201) {
          let result = response;
          result = yield result.json();
          self.id = result.id;
          self.first_name = result.first_name;
          self.last_name = result.last_name;
          self.email = userInfo.email;
          self.token = result.token;
          self.registerError = false;
          self.newUser = true;
          self.loggedIn = true;
          if (getParent(self, 1).cart.itemCount > 0) {
            getParent(self, 1).cart.updateCartCustomer(result.id);
          }

          console.log('created');
          cookies.set(
            'user',
            { token: result.token, id: result.id },
            { path: '/' }
          );
          console.log(cookies.get('user'));
          return true;
        }
      } catch (err) {
        self.registerError = true;
        console.log(err);
        return false;
      }
      self.registerError = false;
      return true;
    }),

    forgotPassword: flow(function* register(userInfo) {
      try {
        const response = yield window.fetch(
          `${getParent(self, 1).apiUrl}/customers/passwordResetRequest`,
          {
            method: 'POST',
            body: JSON.stringify({
              email: userInfo.email
            }),
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${self.getToken()}`
            }
          }
        );

        let result = response;
        result = yield result.json();

        if (result.success) {
          return true;
        }
        return false;
      } catch (err) {
        self.registerError = true;
        console.log(err);
        return false;
      }
    })
  }));

export default User;
