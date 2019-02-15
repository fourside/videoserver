
const listUrl = '/api/list';

export class Client {
  async getList(category :string) {
    const url = category === undefined ? listUrl : listUrl + '/' + category;
    return fetch(url)
      .then((res) => {
        return res.json();
      });
  }
}

