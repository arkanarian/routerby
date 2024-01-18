import _ from "lodash";
import { makeAutoObservable } from "mobx";
import { api, methods } from "../helpers";


class AuthStore {
  token = null;
  isLogged = false;
  isAdmin = false;
  user = {}
  currency = ''
  currency_symbol = ''
  currency_coef = 0
  
  constructor() {
    makeAutoObservable(this);
  }

  async initAuth() {
    const access = localStorage.getItem('access');
    if (access) {
      console.log('initAuth')
      this.token = access;
      // this.isLogged = true;
      await this.me()
    }
  }

  async setAccountFakeBalance(percent) {
    this.user.account.fakeBalance = (this.user.account.money * (percent / 100)).toFixed(4);
  }

  // async setEconomyPercent(data) {
  //   const res = await api('account/set_economy/', methods.POST, JSON.stringify(data), this.token);
  //   if (!res.err) {
  //     await this.getAccount();
  //   }
  // }

  async getAccountAndCard() {
    const res = await api('accounts', methods.GET, null, this.token);
    if (!res.err) {
      this.user.account = res.data;
      // this.setAccountFakeBalance(res.data.economy_percent)
    }
    const res_card = await api('cards/mycard', methods.GET, null, this.token);
    if (!res.err) {
      this.user.card = res_card.data;
    }
    this.user.account.fakeBalance = this.user.card.money
    this.user = _.cloneDeep(this.user);
  }

  async me() {
    const result = await api('users/me', methods.GET, null, this.token);
    if (!result.err) {
      this.user = result.data;
      this.isAdmin = this.user.is_superuser || this.user.is_manager
      console.log("users/me ok")
      this.isLogged = true;
      // await this.getAccountAndCard();
      // this.currency = this.user.card.currency
      // const resp = await api(`cards/exchange_rate_fix`, methods.GET, null, this.token);
      // const exchange_rate = resp.data
      // this.currency_coef = exchange_rate[this.currency]
      // if (this.currency === 'USD') {
      //   this.currency_symbol = '$'
      // }
      // else if (this.currency === 'EUR') {
      //   this.currency_symbol = '€'
      // }
      // else if (this.currency === 'BYN') {
      //   this.currency_symbol = 'Br'
      // }
    }
  }

  async updateCurrency(data) {
    const res = await api(`cards/${this.user.card.id}/update_currency`, methods.POST, JSON.stringify(data), this.token);
    if (!res.err) {
      return
    }
    this.user.card = res.data;
  }

  async register(data, handler) {
    const result = await api('auth/register', methods.POST, JSON.stringify(data), this.token);
    handler(result);
  }

  async login(data, handler) {
    const result = await api('auth/jwt/login', methods.POST, new URLSearchParams(data), this.token, {});
    if (!result.err) {
      this.token = result.data.access_token;
      this.isLogged = true;

      localStorage.setItem("access", this.token);
      await this.me();
    }
    handler(result);
  }

  async logout() {
    if (!this.isLogged) {
      return false;
    }

    const result = await api('auth/jwt/logout', methods.POST, null, this.token);
    if (result.err) {
      return false;
    }

    localStorage.removeItem("access");

    this.isLogged = false;
    this.token = null;
    this.user = {}

    return true;
  }
}


export const authStore = new AuthStore();