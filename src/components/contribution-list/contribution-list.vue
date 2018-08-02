<!-- component script. -->
<script>
// imports.
import moment from 'moment'
import { get, attempt, debounce, last, concat } from 'lodash-es'
import { mapActions } from 'vuex'

// default component export.
export default {
  // component name.
  name: 'u-contribution-list',

  props: {
    limit: {
      type: Number,
      default: 20
    },
    customQuery: {
      type: () => [],
      default: []
    },
    category: {
      type: String,
      default: ''
    },
    projectId: {
      type: String,
      default: ''
    },
    orderBy: {
      validator: function (value) {
        // The value must match one of these strings
        return ['trending', 'new'].indexOf(value) !== -1
      },
      default: 'trending'
    }
  },
  // component data.
  data () {
    return {
      posts: [],
      loading: false,
      query: []
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
      const limit = this.limit
      const query = this.customQuery
        ? this.customQuery : this.buildQuery({ category: this.category })

      const orderBy = get(this.$route, 'meta.order', 'trending')

      const post = this.posts.length > 0
        ? last(this.posts) : {}

      try {
        const result = await this.getContributions({ query, orderBy, limit, post })
        this.posts = concat(this.posts, result)

        // small hack top prevent infinite loop.
        if (result.length < limit) {
          attempt(done)
          this.$refs.infiniteScroll.stop()
        } else {
          attempt(done)
        }
      } catch (err) {
        attempt(done)
        this.$refs.infiniteScroll.stop()
      }
    },
    buildQuery () {
      this.query = []
      if (this.category) {
        this.query.concat(['json_metadata.utopian.category', '==', this.category])
      }

      if (this.projectId) {
        this.query.concat(['json_metadata.utopian.projectId', '==', this.projectId])
      }
    }
  },

  computed: {
  },

  mounted () {
    this.loadInitial()
  },

  // watchers.
  watch: {

    // reload the data as the category changes.
    category () {
      this.loadInitial()
    },
    projectId () {
      this.loadInitial()
    },
    orderBy () {
      this.loadInitial()
    },
    customQuery () {
      this.loadInitial()
    }
  }
}
</script>

<!-- component style. -->
<style lang="stylus" src="./contributions.styl"></style>

<!-- component template. -->
<template lang="pug" src="./contributions.pug"></template>
