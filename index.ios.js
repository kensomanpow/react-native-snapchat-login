import { NativeModules, NativeEventEmitter } from 'react-native'

export const RNSnapchatLogin = NativeModules.SnapchatLogin
export const RNSnapchatLoginEmitter = new NativeEventEmitter(RNSnapchatLogin)

class SnapchatLogin {
  constructor() {
    this.login = this.login.bind(this)
    this.isLogged = this.isLogged.bind(this)
    this.logout = this.logout.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
  }

  login() {
    return new Promise((resolve, reject) => {
      RNSnapchatLogin.login()
        .then(result => {
          if (result.error) {
            reject(result.error)
          } else {
            this.getUserInfo()
              .then(resolve)
              .catch(reject)
          }
        })
        .catch(e => reject(e))
    })
  }

  async isLogged() {
    const { result } = await RNSnapchatLogin.isUserLoggedIn()
    return result
  }

  async logout() {
    const { result } = await RNSnapchatLogin.logout()
    return result
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      return RNSnapchatLogin.fetchUserData()
        .then(async tmp => {
          const data = tmp
          if (data === null) {
            resolve(null)
          } else {
            const { externalId } = await RNSnapchatLogin.getExternalId()
            const { accessToken } = await RNSnapchatLogin.getAccessToken()

            resolve({
              ...data,
              accessToken,
              externalId,
            })
          }
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}

export default new SnapchatLogin()
