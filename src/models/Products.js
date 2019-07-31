// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import Product from './Product';
import ProductDetailsGroup from './ProductDetailsGroup';

const Products = types
  .model({
    loadingProductsError: types.optional(types.boolean, false),
    data: types.optional(types.array(Product), []),
    productDetailsGrouping: types.optional(
      types.array(ProductDetailsGroup),
      []
    ),
    sort: types.optional(types.string, ''),
    filter: types.optional(types.string, ''),
    filterValue: types.optional(types.string, ''),
    searchTerm: types.optional(types.string, '')
  })
  .actions(self => ({
    setProductDetailsArray(productDetailsGroup) {
      self.productDetailsGrouping = productDetailsGroup.items.map(item => ({
        productId: item.fields.productId,
        productModalDetailCopy:
          item.fields.modalProductDetail.fields.productDetailsCopy,
        productDetails: item.fields.productsDetails.map(detail => ({
          productDetailsTitle: detail.fields.productDetailsTitle,
          productDetailsCopy: detail.fields.productDetailsCopy,
          productDetailsMediaFile:
            detail.fields.productDetailsMedia &&
            detail.fields.productDetailsMedia.fields.file.url,
          productDetailsMediaAlt:
            detail.fields.productDetailsMedia &&
            detail.fields.productDetailsMedia.fields.title
        }))
      }));
    },

    updateSort(sort) {
      self.sort = sort;
    },
    updateFilter(filter) {
      self.filter = filter;
    },
    updateSearch(search) {
      self.searchTerm = search;
    },
    updateFilterValue(value) {
      self.filterValue = value;
    },
    resetSort() {
      self.sort = '';
    },
    resetFilter() {
      self.filter = '';
    },
    resetSearch() {
      self.searchTerm = '';
    },
    resetProductList() {
      self.resetSort();
      self.resetFilter();
      self.resetSearch();
    }
  }))
  .views(self => ({
    get productCount() {
      return self.data.length;
    },

    getModalCopy(productID) {
      const modalDetails = self.productDetailsGrouping.filter(
        grouping => parseInt(grouping.productId, 10) === productID
      )[0];

      if (modalDetails.productModalDetailCopy) {
        return modalDetails.productModalDetailCopy;
      }
      return 'false';
    }
  }));

export default Products;
