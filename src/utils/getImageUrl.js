import { IMG_BASE_URL } from "../Components/Helper/axiosinstance";


export const getImageUrl = (url) => {
    if (!url) return "";

    // normalize slashes
    const normalized = url?.replace(/\\/g, "/").replace(/^\/+/, "");

    // if already absolute
    if (normalized.startsWith("http")) {
        return normalized;
    }

    return `${IMG_BASE_URL}/${normalized}`;
};
