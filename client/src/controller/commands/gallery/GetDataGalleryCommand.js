import axios from 'axios'

import RESOLUTIONS from '@/consts/Resolutions'

import GalleryViewVO from '@/model/vos/gallery/GalleryViewVO'
import GalleryViewItemVO from '@/model/vos/gallery/GalleryViewItemVO'

class GetDataGalleryCommand {
  execute (index, quantity) {
    // https://developer.vimeo.com/api/authentication
    console.log('> \t GetDataGalleryCommand > index | quantity =', index, quantity)
    return axios.get('https://api.vimeo.com/users/invisart/likes', {
      params: {
        page: index,
        per_page: quantity,
        access_token: '3dc0bb25295c04f03bf331e5227f963f'
      }})
      .then(response => {
        console.log('> \t GetDataGalleryCommand > data', response.data)
        let inputData = response.data
        let resolution = RESOLUTIONS.R_200_150
        let galleryItems = inputData.data.map((item, index) => {
          // console.log('> GetDataGalleryCommand > item', index, item)
          let imageUrl = item.pictures.sizes[resolution].link
          return new GalleryViewItemVO(item.name, item.uri, imageUrl)
        })
        let pagesLimit = Math.ceil(inputData.total / quantity)
        return new GalleryViewVO(pagesLimit, galleryItems)
      })
      .catch(function (error) {
        Promise.resolve(error)
      })
  }
}

const SINGLETON = new GetDataGalleryCommand()

export default SINGLETON
