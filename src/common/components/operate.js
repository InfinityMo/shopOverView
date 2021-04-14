export default {
  name: 'operate',
  functional: true,
  props: {
    row: {
      type: Object,
      default: null
    },
    render: Function,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, ctx) => {
    const params = {
      row: ctx.props.row,
      index: ctx.props.index
    }
    if (ctx.props.column) {
      params.column = ctx.props.column
    }
    return ctx.props.render(h, params)
  }
}
