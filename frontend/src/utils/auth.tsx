export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('access_token');
    return !!token; // トークンが存在すればtrue
};
