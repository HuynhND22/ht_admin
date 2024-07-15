const accessToken = localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken')
const user = localStorage.getItem('user') ?? sessionStorage.getItem('user')
 export default {accessToken, user}