import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token)
        config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.code === 'ERR_NETWORK')
            window.location.href = `/error?mensagem=${encodeURIComponent('Ligue o Servidor!')}`
        const status = error?.response?.status;
        if (status === 401 && !(error?.config?.url.endsWith('/login'))) {
            localStorage.removeItem('token')
            window.location.href = `/login?mensagem=${encodeURIComponent('Token expirado ou inválido!')}`
        }
        return Promise.reject(error)
    }
)

export default api