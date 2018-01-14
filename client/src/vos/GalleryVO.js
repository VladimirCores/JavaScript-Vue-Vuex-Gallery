export default class GalleryVO
{
    constructor(index, quantity)
    {
        this.index = index;
        this.quantity = quantity;
        this.page = null;
    }

    static default(){
      return new GalleryVO(1,5);
    }
}
