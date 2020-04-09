import { NativeModules, NativeEventEmitter } from 'react-native'

export const RNSnapchatLogin = NativeModules.SnapchatLogin
export const RNSnapchatLoginEmitter = new NativeEventEmitter(RNSnapchatLogin)

class SnapchatLogin {
  succeededListener = null

  failedListener = null

  addListener = (eventType, listener, context) => {
    return RNSnapchatLoginEmitter.addListener(eventType, listener, context)
  }

  removeListeners = () => {
    this.succeededListener.remove()
    this.failedListener.remove()
  }

  login = async () => {
    await RNSnapchatLogin.login()

    return new Promise(async (resolve, reject) => {
      this.succeededListener = this.addListener('LoginSucceeded', async () => {
        this.removeListeners()
        const userData = await this.getUserInfo()
        if (userData) {
          resolve(userData)
        } else {
          reject(new Error('login error'))
        }
      })

      this.failedListener = this.addListener('LoginFailed', () => {
        this.removeListeners()
        resolve(false)
      })
    })
  }

  isLogged = async () => {
    const result = await RNSnapchatLogin.isUserLoggedIn()
    const resultJSON = JSON.parse(result)
    return !!resultJSON.result
  }

  logout = async () => {
    const result = await RNSnapchatLogin.logout()
    const resultJSON = JSON.parse(result)
    return !!resultJSON.result
  }

  getUserInfo = async () => {
    try {
      const userData = await RNSnapchatLogin.fetchUserData()
      if (!userData) return null
      const parsedUserData = JSON.parse(userData)
      const bitmoji = parsedUserData.bitmoji === 'null' ? undefined : parsedUserData.bitmoji
      return {
        ...parsedUserData,
        bitmoji,
      }
    } catch (e) {
      return null
    }
  }
}

export default new SnapchatLogin()
