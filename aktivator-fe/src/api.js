import axios from "axios";

export async function getPeticije(setPeticije, filter = "") {
  console.log("base url", process.env.REACT_APP_API_BASE_URL);
  return await axios
    .get("http://localhost:3005/api/peticija/findPeticija" + filter)

    .then((data) => {
      setPeticije(data.data);
      console.log(data.data);
    });
}

export async function getMojePeticije(setPeticije) {
  const { id } = JSON.parse(localStorage.getItem("user"));
  return await axios
    .get("http://localhost:3005/api/user/moje-peticije/" + id)

    .then((data) => {
      if (setPeticije) setPeticije(data.data);
      console.log("MOJE PETICIJE", data.data);
    });
}

export async function getMojiBlogovi(setBlogs) {
  const { id } = JSON.parse(localStorage.getItem("user"));
  return await axios
    .get("http://localhost:3005/api/user/moji-blogovi/" + id)

    .then((data) => {
      if (setBlogs) setBlogs(data.data);
      console.log("MOJI BLOGOVI", data.data);
    });
}

export async function getPeticija(naslov, setPeticija) {
  return await axios
    .get("http://localhost:3005/api/peticija/singlePeticija/" + naslov)
    .then((data) => {
      setPeticija(data.data);
      console.log(data.data);
    });
}

export async function getBlog(naslov, setBlog) {
  return await axios
    .get("http://localhost:3005/api/blog/singleBlog/" + naslov)
    .then((data) => {
      setBlog(data.data);
      console.log(data.data);
    });
}

export async function getSubs(userID, SetSubs) {
  return await axios
    .get("http://localhost:3005/api/user/get-subs/" + userID)
    .then((res) => {
      if (res.status === 200) {
        SetSubs(res.data.data);
        console.log("MOJI TAGOVI", res.data.data);
      }
    })
    .catch((error) => {
      console.log(error.response);
    });
}

export async function deleteBlog(naslov) {
  return await axios
    .delete("http://localhost:3005/api/blog/deleteBlog/" + naslov)
    .catch((error) => {
      if (error.response.status === 406) {
        console.log(error.response.message);
      } else {
        console.log(error.response);
      }
    });
}

export async function deletePeticija(naslov) {
  return await axios
    .delete("http://localhost:3005/api/peticija/deletePeticija/" + naslov)
    .catch((error) => {
      if (error.response.status === 406) {
        console.log(error.response.message);
      } else {
        console.log(error.response);
      }
    });
}

export async function deleteTag(tagg, userID) {
  console.log(userID);
  return await axios
    .put("http://localhost:3005/api/user/unfollow", {
        userId: userID,
        tag: tagg,
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.status === 406) {
        console.log(error.response.data.message);
      } else {
        console.log(error.response);
      }
    });
}
