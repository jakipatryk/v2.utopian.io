<script>
import moment from 'moment'
import UContributionList from 'src/components/contribution-list/contribution-list'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'
import { format } from 'quasar'

const { capitalize } = format

export default {
  name: 'PageProjectContributions',
  components: {
    UContributionList,
    ULayoutPage
  },

  props: {
    project: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      category: ''
    }
  },
  filters: {
    timeAgo (isoDateString) {
      return moment.utc(isoDateString).fromNow()
    }
  },
  methods: {
  },
  computed: {
    categories () {
      return categories
    },
    categoryOptions () {
      return [{ label: 'All categories', value: '' }].concat(
        categoryOptions.map(category => ({ ...category, label: capitalize(category.label) }))
      )
    }
  }
}
</script>

<style lang="stylus" src="./contributions.styl"></style>

<template lang="pug" src="./contributions.pug"></template>
