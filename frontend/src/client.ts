
const listUrl = '/api/list';
const categoryUrl = '/api/category';
const postUrlUrl = '/api/url';

export default class Client {
  async getList(category :string) {
    const url = category === undefined ? listUrl : listUrl + '/' + category;
    return fetch(url)
      .then(res => {
        return res.json();
      }).then(json => {
        return json["videos"]
      });
  }

  async getCategory() {
    return fetch(categoryUrl)
      .then(res => {
        return res.json();
      }).then(json => {
        return json["categories"];
      });
  }

  async postUrl(data) {
    return fetch(postUrlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  }
}

