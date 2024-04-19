class APIFilters {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",  // Case-insensitive search
            },
          }
        : {};
  
      this.query = this.query.find({...keyword});
      return this;
    }
  
    filters() {
      const queryCopy = {...this.queryStr};
      // Fields to remove before applying filters
      const fieldsToRemove = ['keyword', 'page', 'limit', 'sort']; // Add any other fields that should not be directly used in MongoDB queries
      fieldsToRemove.forEach((el) => delete queryCopy[el]);
             
      // Convert fields from simple expressions like 'gte' to MongoDB operators like '$gte'
      let queryStr = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

      console.log(queryCopy)

      // Advanced filter for price, ratings, etc.
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }

    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip)
        return this;
    }
  
}
  
export default APIFilters;
