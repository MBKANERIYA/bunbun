export const getAuthData = () => {
    try {
        return JSON.parse(localStorage.getItem("authToken"));
    } catch {
        return null;
    }
};

export const getAuthUser = () => {
    const authData = getAuthData();
    return authData?.user || authData?.User || null;
};

export const getAuthUserId = () => {
    return getAuthUser()?._id || null;
};

export const notifyAuthChanged = () => {
    window.dispatchEvent(new Event("authChanged"));
};
