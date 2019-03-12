const listUrl = '/api/list';
const categoryUrl = '/api/category';
const postUrlUrl = '/api/url';
const progressUrl = '/api/progress';

export default class Client {
  getList<T>(category: string, offset: number): Promise<T> {
    const url = category === undefined ? listUrl : listUrl + '/' + category;
    const query =
      offset === 0 || offset === undefined ? '' : `?offset=${offset}`;
    return fetch(url + query)
      .then(res => {
        return res.json();
      })
      .then(json => {
        return json;
      });
  }

  async getCategory() {
    return fetch(categoryUrl)
      .then(res => {
        return res.json();
      })
      .then(json => {
        return json['categories'];
      });
  }

  async postUrl(data) {
    return fetch(postUrlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async getProgress() {
    return fetch(progressUrl)
      .then(res => {
        return res.json();
      })
      .then(json => {
        return json['progresses'];
      });
  }
}
