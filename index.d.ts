declare module 'react-native-snapchat-login' {
  interface SnapchatUserData {
    displayName: string
    externalId: string
    bitmoji: string | null
    accessToken: string
    error?: any
  }

  export default class SnapchatLogin {
    static login(): Promise<SnapchatUserData | null>
    static getUserInfo(): Promise<SnapchatUserData | null>
    static isLogged(): Promise<boolean>
    static logout(): Promise<boolean>
    static addListener(eventType, listener, context) 
    static removeListeners()
  }
}
