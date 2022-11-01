import build from '../../scripts/build'

export default {
  ...build,
  externals: [
    'vue-use-form',
    'yup',
  ],
}
