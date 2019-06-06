/* MobX-State-Tree uses reassignment to self. Disable that rule for model files */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { types, flow, getParent } from 'mobx-state-tree';
import ProductOptions from './ProductOptions';
import ProductVariants from './ProductVariants';
import ProductImages from './ProductImages';
import ProductReviews from './ProductReviews';

const Product = types
  .model({
    id: types.number,
    sku: types.string,
    name: types.string,
    description: types.optional(types.string, ''),
    page_title: types.optional(types.string, ''),
    meta_description: types.optional(types.string, ''),
    price: types.optional(types.number, 0),
    variantPrice: types.optional(types.number, 0),
    sale_price: types.optional(types.number, 0),
    retail_price: types.optional(types.number, 0),
    categories: types.optional(types.array(types.number), []),
    thumbnail_url: types.maybeNull(types.string, ''),
    initial_image_for_images: types.maybeNull(types.string, ''),
    options: types.optional(types.array(ProductOptions), []),
    // all possible comboniations of option selections that can be made out of product options.
    variants: types.optional(types.array(ProductVariants), []),
    quantity_in_cart: types.optional(types.number, 0),
    images: types.optional(types.array(ProductImages), []),
    inventory_level: types.optional(types.number, 0),
    average_rating: types.optional(types.number, 0),
    star1_rating: types.optional(types.number, 0),
    star2_rating: types.optional(types.number, 0),
    star3_rating: types.optional(types.number, 0),
    star4_rating: types.optional(types.number, 0),
    star5_rating: types.optional(types.number, 0),
    reviews: types.optional(types.array(ProductReviews), []),
    OOSaray: types.optional(types.array(types.number), []),
    inventory_warning_level: types.optional(types.number, 0),
    reviewSort: types.optional(types.string, ''),
    reviewFilter: types.optional(types.number, 0),
    filteredRevsLength: types.optional(types.number, 0)
  })
  .views(self => ({
    getPrice() {
      if (self.variantPrice === 0) {
        return self.price.toFixed(2)
      }
      return self.variantPrice.toFixed(2)
    }
  }))
  .actions(self => ({
    updateReviewSort(sort) {
      self.reviewSort = sort;
    },

    resetReviewSort() {
      self.reviewSort = '';
    },

    updateReviewFilter(filter) {
      self.reviewFilter = filter;
    },

    resetReviewFilter() {
      self.reviewFilter = 0;
    },

    filterReviews() {
      if (self.reviewFilter) {
        const filteredRevs = self
          .sortReviews()
          .filter(rev => rev.rating === self.reviewFilter);
        self.filteredRevsLength = filteredRevs.length;
        return filteredRevs;
      }

      const filteredRevs = self.sortReviews();
      self.filteredRevsLength = filteredRevs.length;
      return filteredRevs;
    },

    sortReviews() {
      if (self.reviewSort === 'lowHigh') {
        return self.reviews.slice().sort((a, b) => a.rating - b.rating);
      }

      if (self.reviewSort === 'highLow') {
        return self.reviews.slice().sort((a, b) => b.rating - a.rating);
      }

      if (self.reviewSort === 'mostRecent') {
        return self.reviews
          .slice()
          .sort(
            (a, b) => new Date(a.date_created) - new Date(b.date_created)
          );
      }

      return self.reviews;
    },

    addToOOSarray(id) {
      self.OOSaray.push(id);
    },

    clearOOSarray() {
      self.OOSaray = [];
    },

    swapImg(url) {
      if (self.images.length !== 0) {
        self.images[0] = {
          id: 0,
          product_id: self.id,
          zoom_url: url,
          thumbnail_url: url,
          standard_url: url,
          tiny_url: url,
          sort_order: 1
        };
      }
    },

    setSku(sku) {
      self.sku = sku;
    },

    setVariantPrice(price) {
      self.variantPrice = price;
    },

    findByVariant(optionValueId1) {
      const images = self.variants.map(variant => {
        if (self.options.length) {
          if (self.options.length === 1) {
            if (variant.values[0].id === optionValueId1) {
              self.setSku(variant.sku)
              self.setVariantPrice(variant.calculated_price)
              if (variant.image_url) {
                return variant.image_url
              }
            }
          }
        }
      });
      const image = images.filter(i => i !== undefined);
      return image;
    },

    setImage() {
      const shop = getParent(self, 3);
      if (self.thumbnail_url === null) {
        self.thumbnail_url = shop.contentful.imagePlaceholder;
      }
    },
    getProductImages: flow(function* getProductImages() {
      try {
        const response = yield window.fetch(
          `${getParent(self, 3).apiUrl}/products/${self.id}/images`
        );
        let json = response;
        json = yield json.json();
        if (self.images.slice().length <= 1) {
          const orderedImgages = json.sort(
            (a, b) => a.sort_order - b.sort_order
          );
          self.initial_image_for_images = orderedImgages[0].zoom_url;
          orderedImgages.map(image => {
            self.images.push({
              id: image.id,
              product_id: image.product_id,
              zoom_url: image.zoom_url,
              thumbnail_url: image.thumbnail_url,
              standard_url: image.standard_url,
              tiny_url: image.tiny_url,
              sort_order: image.sort_order,
              is_thumbnail: image.is_thumbnail
            });

            return true;
          });
        }
      } catch (err) {
        console.log(err);
      }
    }),

    getProductReviews: flow(function* getProductReviews() {
      try {
        const response = yield window.fetch(
          `${getParent(self, 3).apiUrl}/products/${self.id}/reviews`
        );
        let json = response;
        json = yield json.json();
        // if (self.reviews.length === 0) {
        self.average_rating = parseFloat(json.average_rating);
        const orderedReviews = json.reviews.sort(
          (a, b) => new Date(a.date_created) - new Date(b.date_created)
        );
        orderedReviews.map(review => {
          self.reviews.push({
            id: review.id,
            email: review.email,
            name: review.name,
            rating: review.rating,
            text: review.text,
            title: review.title,
            status: review.status,
            date_created: review.date_created,
            date_modified: review.date_modified,
            date_reviewed: review.date_reviewed
          });
          self.calculateStarDistribution(json);
          return true;
        });
        // }
      } catch (err) {
        console.log(err);
      }
    }),

    calculateStarDistribution(json) {
      self.star1_rating = json.reviews.filter(
        review => review.rating === 1
      ).length;
      self.star2_rating = json.reviews.filter(
        review => review.rating === 2
      ).length;
      self.star3_rating = json.reviews.filter(
        review => review.rating === 3
      ).length;
      self.star4_rating = json.reviews.filter(
        review => review.rating === 4
      ).length;
      self.star5_rating = json.reviews.filter(
        review => review.rating === 5
      ).length;
    },

    afterCreate() {
      self.getProductImages();
      self.getProductReviews();
      self.setImage();
    }
  }))
  .views(self => ({
    get productTotal() {
      const productTotal = self.price * self.quantity_in_cart;
      return productTotal.toFixed(2);
    },

    findInOOSarray(id) {
      return self.OOSaray.some(oosId => oosId === id);
    }
  }));

export default Product;
