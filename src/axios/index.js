import axios from 'axios';

export default axios.create({
    baseURL: 'http://node2-env-1.eba-3jaztibh.us-east-2.elasticbeanstalk.com/',
    // baseURL: 'http://localhost:8080/',
})