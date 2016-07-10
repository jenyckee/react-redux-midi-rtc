// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import { injectReducer } from '../store/reducers'
import Home from './Home'
import CounterRoute from './Counter'
import PlayerRoute from './Player'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path: '/',
  // component: CoreLayout,
  indexRoute: Home,
  childRoutes: [
    CounterRoute(store),
    PlayerRoute(store),
  ],

  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Conductor = require('../layouts/CoreLayout').default
      const reducer = require('../modules/conductor').default

      /*  Add the reducer to the store on key 'conductor'  */
      injectReducer(store, { key: 'conductor', reducer })

      /*  Return getComponent   */
      cb(null, Conductor)

    /* Webpack named bundle   */
    }, 'conductor')
  }
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
