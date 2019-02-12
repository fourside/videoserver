
const listUrl = '/api/list';

export class Client {
  async getList() {
    return fetch(listUrl)
      .then((res) => {
        return res.json();
      });
  }
}

