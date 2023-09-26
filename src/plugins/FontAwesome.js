/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faPencilAlt)

export default (app) => {
  // eslint-disable-next-line vue/multi-word-component-names
  app.component('fa', FontAwesomeIcon)
}
