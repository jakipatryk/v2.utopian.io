<template>
  <q-input
    type="textarea"
    :maxHeight="maxHeight"
    :class="allClasses"
    :id="id"
    :value="value"
    :placeholder="placeholder"
    :readonly="readonly"
    @input="handleChange"
    @change="handleChange"
  />
</template>

<script>
import { QInput } from 'quasar'

export default {
  name: 'u-textarea',
  components: {
    QInput
  },
  props: ['value', 'placeholder', 'readonly', 'classes', 'id', 'maxHeight'],
  computed: {
    allClasses () {
      return 'u-input ' + this.classes
    }
  },
  methods: {
    handleChange (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="stylus">
  .u-input {
    background #fff
    border solid 1px #e0e2e5
    border-bottom none
    padding-top 8px
    padding-left 10px
    &:before {
      background #e0e2e5
    }
  }
</style>
