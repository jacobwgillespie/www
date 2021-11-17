export default {
  /**
   * @param {Request} request
   * @param {*} env
   */
  async fetch(request, env) {
    if (req.url.startsWith('/service-worker.js')) {
      const next = new Request('/static/service-worker.js', new Request(request))
      return fetch(next)
    }

    return env.ASSETS.fetch(request)
  },
}
