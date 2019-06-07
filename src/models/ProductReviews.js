/* eslint-disable no-param-reassign */
import { types } from 'mobx-state-tree';

const ProductReviews = types
  .model({
    id: types.number,
    email: types.optional(types.string, ''),
    name: types.optional(types.string, ''),
    rating: types.optional(types.number, 0),
    text: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    status: types.optional(types.string, ''),
    date_created: types.optional(types.string, ''),
    date_modified: types.optional(types.string, ''),
    date_reviewed: types.optional(types.string, ''),
  })
  .actions(self => ({
    initialize(review) {
      self.id = review.id;
      self.email = review.email;
      self.name = review.name;
      self.rating = review.rating;
      self.text = review.text;
      self.title = review.title;
      self.status = review.status;
      self.date_created = review.date_created;
      self.date_modified = review.date_modified;
      self.date_reviewed = review.date_reviewed;
    },

  }));

export default ProductReviews;
