const taxonomy_parser = require('./taxonomy_parser')
const MiniSearch = require('minisearch')

class matcher {
    constructor(locale = 'en-GB', threshold = 100) {
        this.taxonomy = new taxonomy_parser(locale);
        this.threshold = threshold;
        this.miniSearch = new MiniSearch({
            fields: ['full_path', 'full_path_scrubbed'], // fields to index for full-text search
            storeFields: ['full_path', 'category'] // fields to return with search results
        })

        this.miniSearch.addAll(this.taxonomy.read())
    }

    match(title, miniSearchOpts = { fuzzy: 0.2, boost: { category: 2 } }) {
        let matched = this.miniSearch.search(title, miniSearchOpts);
        if (!matched || matched.score < this.threshold) return false
        else return matched;
    }
    
    autosuggest(word) {
        
        let matched = this.miniSearch.autoSuggest(word);
        if (!matched || matched.score < this.threshold) return false
        else return matched;
    } 
}

module.exports = matcher;