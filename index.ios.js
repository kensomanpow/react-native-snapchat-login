import { NativeModules, NativeEventEmitter } from 'react-native'

export const RNSnapchatLogin = NativeModules.SnapchatLogin
export const RNSnapchatLoginEmitter = new NativeEventEmitter(RNSnapchatLogin)

class SnapchatLogin {
  addListener = (eventType, listener, context) => {
    // NO USE
  }

  removeListeners = () => {
    // NO USE
  }


  login = async () => {
    try {
      const response = await RNSnapchatLogin.login()
      if (!response.result) return `${response.error}`
      return true
    } catch (e) {
      throw new Error(`${e}`)
    }
  }

  isLogged = async () => {
    try {
      const { result } = await RNSnapchatLogin.isUserLoggedIn()
      return result
    } catch (e) {
      throw new Error(`${e}`)
    }
  }

  logout = async () => {
    try {
      const { result } = await RNSnapchatLogin.logout()
      return result
    } catch (e) {
      throw new Error(`${e}`)
    }
  }

  getUserInfo = async () => {
    try {
      const responseUserData = await RNSnapchatLogin.fetchUserData()
      if (!responseUserData) return null

      const { externalId } = await RNSnapchatLogin.getExternalId()
      const { accessToken } = await RNSnapchatLogin.getAccessToken()
      const bitmoji = responseUserData.bitmoji === 'null' ? undefined : responseUserData.bitmoji

      return {
        ...responseUserData,
        externalId,
        accessToken,
        bitmoji,
      }
    } catch (e) {
      throw new Error(`${e}`)
    }
  }
}

export default new SnapchatLogin()
