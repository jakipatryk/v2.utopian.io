<!-- component script. -->
<script>
// imports.
import moment from 'moment'
import { map, get, attempt, debounce, last, concat } from 'lodash-es'
// import { byOrder } from 'src/services/steem/posts'
import UPostPreview from 'src/components/post-preview/post-preview'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'
import { mapActions } from 'vuex'

// default component export.
export default {
  // component name.
  name: 'u-page-contributions',

  // child components.
  components: {
    UPostPreview,
    ULayoutPage
  },

  // component data.
  data () {
    return {
      // page sort.
      sortBy: 'trending',
      // page sort options.
      sortOptions: [
        { label: 'Trending', value: 'trending' },
        { label: 'New', value: 'new' }
      ],
      // loading state indicator.
      loading: false,
      // currently selected category.
      category: 'utopian-io',
      // loaded contributions / posts.
      posts: [],
      // current search.
      search: ''
    }
  },

  // component local filters.
  // @TODO this should be done at content parsing state, not rendering.
  filters: {
    timeAgo (isoDateString) {
      return moment.utc(isoDateString).fromNow()
    }
  },

  // component methods.
  methods: {
    ...mapActions('contributions', [
      'getContributions'
    ]),
    // initial content loading.
    loadInitial () {
      // start loading as true.
      this.loading = true
      // call teh load posts method.
      return this.loadPosts().then((result) => {
        // disable the loading indicator
        this.loading = false
        // return the results to complete the promise.
        return result
      })
    },

    // debounced post loading (paginated).
    loadPostsScroll: debounce(function (index, done) {
      return this.loadPosts(done)
    }, 3000),

    // load posts main method.
    async loadPosts (done) {
      const limit = 2
      const query = this.$route.params.category && this.$route.params.category !== 'utopian-io'
        ? [['json_metadata.utopian.category', '==', this.$route.params.category]] : []

      const orderBy = get(this.$route, 'meta.order', 'trending')

      const post = this.posts.length > 0
        ? last(this.posts) : {}

      try {
        const result = await this.getContributions({ query, orderBy, limit, post })
        this.posts = concat(this.posts, result)

        console.log(result)
        // small hack top prevent infinite loop.
        if (result.length < limit) {
          attempt(done)
          this.$refs.infiniteScroll.stop()
        } else {
          attempt(done)
        }
      } catch (err) {
        console.log(err)
        attempt(done)
        this.$refs.infiniteScroll.stop()
      }
    }
  },

  // computed properties.
  computed: {

    // compute available categories (alias).
    categories () {
      return categories
    },

    // map the categories into a selectable array.
    categoryOptions () {
      return map(categoryOptions, (option) => {
        // @TODO upper case should be handler at CSS level, not runtime transformations.
        option.label = option.label.toUpperCase()
        return option
      })
    },

    // currently selected category filter.
    currentCategory () {
      return get(this.$route, 'params.category', null)
    }
  },

  // mounted hook.
  mounted () {
    // start sort and category from route, defaulting to trending, all categories.
    this.sortBy = get(this.$route, 'meta.order', 'trending')
    this.category = get(this.$route, 'params.category', 'utopian-io')

    // load initial content.
    this.loadInitial()

    // just return something to be polite.
    return true
  },

  // watchers.
  watch: {

    // reload the data as the category changes.
    currentCategory () {
      this.loadInitial()
    }
  }
}
</script>

<!-- component style. -->
<style lang="stylus" src="./contributions.styl"></style>

<!-- component template. -->
<template lang="pug" src="./contributions.pug"></template>
