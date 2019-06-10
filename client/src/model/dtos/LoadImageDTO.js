export default class LoadImageDTO {
  constructor (width, height, onprogress) {
    this.width = width
    this.height = height
    this.onprogress = onprogress
  }
}
