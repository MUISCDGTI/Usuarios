const urlJoin = require('url-join');
const request = require('request-promise-native').defaults({ json: true });

class SuscriptionsResource {

  static suscriptionsUrl(resourceUrl) {
    const suscriptionsServer = (process.env.SUSCRIPTIONS_URL || 'https://suscripciones-amaliof96.cloud.okteto.net/api/v1');
    return urlJoin(suscriptionsServer, resourceUrl);
  }

  static getUserSuscriptions(email, apikey) {
    const url = SuscriptionsResource.suscriptionsUrl('/suscripciones?email=' + email + '&apikey=' + apikey);

    return request.get(url);
  }

  static deleteSuscription(suscriptionId, apikey) {
    const url = SuscriptionsResource.suscriptionsUrl('/suscripciones/' + suscriptionId + '?apikey=' + apikey);

    return request.delete(url);
  }
}

module.exports = SuscriptionsResource;