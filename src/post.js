const post = async (url, data) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
      dataType: "json",
      crossDomain: true,
      contentType: "application/json; charset=utf-8",
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Could not post data");
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err.message);
      });
  });
};

export default post;
