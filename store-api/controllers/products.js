const Product = require("../models/product")

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}

    if (featured) { queryObject.featured = featured === "true" ? true : false }

    if (company) { queryObject.company = company }

    if (name) { queryObject.company = { $regex: name, option: "i" } }

    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",  // greater than 
            ">=": "$gte", // greater than or equal to
            "<": "$lt",  // less than
            "<=": "$lte" // less than or equal to
        }
        const regEx = /\b(<|>|>=|<|<=)\b/g;

        let filters = numericFilters.replace(regEx, match => `-${ operatorMap[match] }-`)
        const options = ["price", "rating"]
        filters = filters.split(",").forEach(filter => {
            const [key, operator, value] = filter.split("-")
            if (options.includes(key)) {
                queryObject[key] = { [operator]: +value }
            }
        })
    }

    let result = Product.find(queryObject)

    if (sort) {
        let sortList = sort.split(",").join(" ")
        result = result.sort(sortList)
    } else {
        result = result.sort("createdAt")
    }
    if (fields) {
        let fieldsList = fields.split(",").join(" ")
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)
    const products = await result

    res.status(200).json({ products, nHits: products.length })
};

module.exports = { getAllProducts }


