import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../Components/Helper/axiosinstance";

const baseQueryOffline = fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers, { getState }) => {
        const token = getState()?.user?.userData?.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export default baseQueryOffline;
