import ServerVO from '@/model/vos/ServerVO'

export default class ApplicationVO {
  constructor () {
    this.user = null
    this.device = null
    this.server = new ServerVO()
  }
}
