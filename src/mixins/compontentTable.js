
const compontentTable = {
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
    _setFixed (key, columnLength) {
      const clientHeight = document.documentElement.clientWidth || document.body.clientWidth
      if (clientHeight < 1920) {
        return columnLength > 7 ? key === 'brand' ? 'left' : '' : ''
      } else {
        return columnLength > 11 ? key === 'brand' ? 'left' : '' : ''
      }
    },
    _setWidth (key, columnLength) {
      const clientHeight = document.documentElement.clientWidth || document.body.clientWidth
      let width = ''
      if (key === 'brand') {
        width = '140'
        return width
      }
      if (key === 'link') {
        width = '309'
        return width
      }
      if (clientHeight < 1920) {
        width = columnLength > 7 ? '150' : ''
      } else {
        width = columnLength > 11 ? '150' : ''
      }
      return width
    }
  }
}

export default compontentTable
