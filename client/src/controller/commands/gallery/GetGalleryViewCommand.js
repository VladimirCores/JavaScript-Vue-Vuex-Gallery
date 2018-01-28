import axios from 'axios'

import RESOLUTIONS from '@/consts/Resolutions'

import GalleryViewVO from '@/vos/gallery/GalleryViewVO'
import GalleryViewItemVO from '@/vos/gallery/GalleryViewItemVO'

class GetGalleryViewCommand {
  execute (index, quantity) {
    // https://developer.vimeo.com/api/authentication
    console.log('> \t GetGalleryViewCommand > index | quantity =', index, quantity)
    return axios.get('https://api.vimeo.com/users/invisart/likes', {
      params: {
        page: index,
        per_page: quantity,
        access_token: '3dc0bb25295c04f03bf331e5227f963f'
      }})
      .then(response => {
        console.log('> \t GetGalleryViewCommand > data', response.data)
        let inputData = response.data
        let galleryItems = inputData.data.map((item) => {
          // console.log('> GetGalleryViewCommand > item', item)
          let link = item.pictures.sizes[RESOLUTIONS.R_200_150].link
          return new GalleryViewItemVO(
            item.name,
            item.uri,
            link
          )
        })
        let pagesLimit = Math.ceil(inputData.total / quantity)
        console.log(new GalleryViewVO(pagesLimit, galleryItems))
        return new GalleryViewVO(pagesLimit, galleryItems)
      })
      .catch(function (error) {
        Promise.resolve(error)
      })
  }
}

const SINGLETON = new GetGalleryViewCommand()

export default SINGLETON
