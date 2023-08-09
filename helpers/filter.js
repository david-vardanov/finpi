function buildFilterOptions({ dateFrom, dateTo, categories, tags, minAmount, maxAmount }) {
    const filterOptions = {};
  
    if (dateFrom || dateTo) {
      filterOptions.date = {};
      if (dateFrom) {
        filterOptions.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filterOptions.date.$lte = new Date(dateTo);
      }
    }
  
    if (categories && categories.length > 0) {
      filterOptions.category = { $in: categories };
    }
  
    if (tags && tags.length > 0) {
      filterOptions.tags = { $all: tags };
    }
  
    if (minAmount || maxAmount) {
      filterOptions.amount = {};
      if (minAmount) {
        filterOptions.amount.$gte = minAmount;
      }
      if (maxAmount) {
        filterOptions.amount.$lte = maxAmount;
      }
    }
  
    return filterOptions;
  }
  
  module.exports = buildFilterOptions;
  