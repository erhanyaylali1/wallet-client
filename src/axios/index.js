import axios from 'axios';

let instance;
if(localStorage.getItem("token")){
    instance = axios.create({
        // baseURL: 'http://node2-env-1.eba-3jaztibh.us-east-2.elasticbeanstalk.com/',
        baseURL: 'http://localhost:8080/',
        headers: { Authorization: localStorage.getItem("token") }
    })
} else {
    instance = axios.create({
        // baseURL: 'http://node2-env-1.eba-3jaztibh.us-east-2.elasticbeanstalk.com/',
        baseURL: 'http://localhost:8080/',
    })
}


export default instance