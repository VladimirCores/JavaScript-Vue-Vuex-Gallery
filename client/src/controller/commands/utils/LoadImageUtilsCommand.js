/**
 * Loads an image with progress callback.
 *
 * The `onprogress` callback will be called by XMLHttpRequest's onprogress
 * event, and will receive the loading progress ratio as an whole number.
 * However, if it's not possible to compute the progress ratio, `onprogress`
 * will be called only once passing -1 as progress value. This is useful to,
 * for example, change the progress animation to an undefined animation.
 *
 * @param  {string}   imageUrl   The image to load
 * @param  {Function} onprogress
 * @return {Promise}
 */

class LoadImageUtilsCommand {
  execute (imageUrl, onprogress) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      let notifiedNotComputable = false

      xhr.open('GET', imageUrl, true)
      xhr.responseType = 'arraybuffer'
      console.log('> LoadImageUtilsCommand -> imageUrl = ' + imageUrl)

      if (onprogress) {
        xhr.onprogress = function (ev) {
          if (ev.lengthComputable) {
            onprogress(parseInt((ev.loaded / ev.total) * 100))
          } else {
            if (!notifiedNotComputable) {
              notifiedNotComputable = true
              onprogress(-1)
            }
          }
        }
      }
      xhr.onerror = function () { resolve(null) }
      xhr.onloadend = function () {
        if (!xhr.status.toString().match(/^2/)) {
          reject(xhr)
        } else {
          let blob = new Blob([this.response])
          resolve(window.URL.createObjectURL(blob))
        }
      }

      xhr.send()
    })
  }
}

const SINGLETON = new LoadImageUtilsCommand()

export default SINGLETON
