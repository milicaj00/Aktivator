import axios from "axios";
import { toast } from "react-toastify";

const notify = mess => toast.success(mess);
const notifyError = text => toast.error(text);

export async function getPeticije(setPeticije, filter = "") {
    console.log("base url", process.env.REACT_APP_API_BASE_URL);
    return await axios
        .get("http://localhost:3005/api/peticija/findPeticija" + filter)

        .then(data => {
            setPeticije(data.data);
            console.log(data.data);
        });
}

export async function getMojePeticije(setPeticije) {
    const { id } = JSON.parse(localStorage.getItem("user"));
    return await axios
        .get("http://localhost:3005/api/user/moje-peticije/" + id)

        .then(data => {
            setPeticije(data.data);
            console.log(data.data);
        });
}

export async function getMojiBlogovi(setBlogs) {
    const { id } = JSON.parse(localStorage.getItem("user"));
    return await axios
        .get("http://localhost:3005/api/user/moji-blogovi/" + id)

        .then(data => {
            if (setBlogs) setBlogs(data.data);
            console.log("MOJI BLOGOVI", data.data);
        });
}

export async function getPeticija(naslov, setPeticija) {
    return await axios
        .get("http://localhost:3005/api/peticija/singlePeticija/" + naslov)
        .then(data => {
            setPeticija(data.data);
            console.log(data.data);
        });
}
