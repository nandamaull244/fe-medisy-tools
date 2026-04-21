import { useEffect, useState } from "react";
import {getFaskes} from "@/services/faskes.service";
import { get } from "http";

export const useFaskes = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getFaskes().then(setData);
    }, []);

    return {data};
};
