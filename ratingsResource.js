const urlJoin = require('url-join');
const request = require('request-promise-native').defaults({ json: true });

class RatingsResource {

  static ratingsUrl(resourceUrl) {
    const ratingsServer = (process.env.RATINGS_URL || 'http://localhost:3000/api/v1');
    return urlJoin(ratingsServer, resourceUrl);
  }

  static requestHeaders() {
    const ratingsApiKey = (process.env, RATINGS_API_KEY || '');
    return { apikey: ratingsApiKey };
  }

  static getUserRatings(name) {
    const url = RatingsResource.ratingsUrl('/ratings');

    const headers = RatingsResource.requestHeaders();
    headers.user = name;

    const options = {
      headers: headers
    };
    return request.get(url, options);
  }

  static deleteRating(ratingId) {
    const url = RatingsResource.ratingsUrl('/ratings/' + ratingId);

    const headers = RatingsResource.requestHeaders();

    const options = {
      headers: headers
    };

    return request.delete(url, options);
  }
}

module.exports = RatingsResource;