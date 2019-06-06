/* eslint-disable no-param-reassign */
import { types } from 'mobx-state-tree';

const ProductImages = types
  .model({
    id: types.number,
    product_id: types.optional(types.number, 0),
    zoom_url: types.optional(types.string, ''),
    thumbnail_url: types.optional(types.string, ''),
    standard_url: types.optional(types.string, ''),
    tiny_url: types.optional(types.string, ''),
    sort_order: types.optional(types.number, 0),
    is_thumbnail: types.optional(types.boolean, false)
  })
  .actions(self => ({
    initialize(image) {
      self.id = image.id;
      self.product_id = image.product_id;
      self.zoom_url = image.zoom_url;
      self.thumbnail_url = image.thumbnail_url;
      self.standard_url = image.standard_url;
      self.tiny_url = image.tiny_url;
      self.sort_order = image.sort_order;
      self.is_thumbnail = image.is_thumbnail;
    }
  }));

export default ProductImages;
