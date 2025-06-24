
export const checkAuth = async () => {
    const response = await fetch("http://localhost:8000/auth/me", {
        method: "GET",
        credentials: "include",
    });

    return response
};