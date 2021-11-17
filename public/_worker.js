export default {
  /**
   * @param {Request} request
   * @param {*} env
   */
  async fetch(request, env) {
    if (req.url.startsWith('/service-worker.js')) {
      const next = new Request(request)
      next.url = '/static/service-worker.js'
      return fetch(next)
    }

    return env.ASSETS.fetch(request)
  },
}
