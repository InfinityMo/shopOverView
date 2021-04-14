export const pkDataFrom = {
  dataType: '',
  promot: []
}
export const pkDataFromRules = {
  dataType: [
    { required: true, message: '请选择数据类型', trigger: 'change' }
  ],
  promot: [
    { required: true, message: '请选择推广工具', trigger: 'change' }
  ]
}
