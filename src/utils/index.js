import axios from "axios";
export function getCurrentCity() {
  //1.使用localStorage中获取当前定位城市
  const localCity = JSON.parse(localStorage.getItem("hkzf_city"));
  if (!localCity) {
    return new Promise((resolve, reject) => {
      const city = new window.BMapGL.LocalCity();
      city.get(async (res) => {
        try {
          const { data } = await axios.get("http://localhost:8080/area/info", {
            params: { name: res.name },
          });

          //data.body.label

          localStorage.setItem("hkzf_city", JSON.stringify(data.body));

          //怎么让它获取到异步的回调数据? 通过promise
          resolve([data.body]);
        } catch (error) {
          reject(error);
        }
      });
    });
  } else {
    return Promise.resolve([localCity]);
  }
}

export function getCenter() {
  const city = new window.BMapGL.LocalCity();
  return new Promise((resolve, reject) => {
    city.get(async (res) => {
      try {
        resolve(res.center);
      } catch (error) {
        reject(error);
      }
    });
  });
}
