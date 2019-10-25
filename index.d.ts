declare module 'react-native-snapchat-login' {
  interface SnapchatUserData {
    displayName: string
    externalId: string
    bitmoji: string | null
    accessToken: string
    error?: any
  }

  export default class SnapchatLogin {
    login(): Promise<SnapchatUserData | null>
    getUserInfo(): Promise<SnapchatUserData | null>
    isLogged(): Promise<boolean>
    logout(): Promise<boolean>
  }
}
