import build from '../../scripts/build'
import type { Options } from 'tsup'

export default <Options>{
  ...build,
  entryPoints: [
    'src/index.ts',
  ],
}
