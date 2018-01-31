export default class ServerVO {
  constructor (obj) {
    console.log(obj)
    this.url = 'https://api.vimeo.com/users'
    this.userID = null
    this.accessKey = null
    this.accessToken = null
  }
}
