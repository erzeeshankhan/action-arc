// This file is a custom Hook to handle the API calls states such as is loading, storing data, errors, etc
// (cb) = call back
import { useState } from "react";
import { toast } from "sonner"; 

// const { useState } = require("react");
// const { toast } = require("sonner");

const useFetch = (cb) => {

    // the function contains the following states
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const fn = async(...args) => {
        // before fetching our api, we gonna set below settings
        setLoading(true);
        setError(null);

        // for handling our errors, we use try catch block
        try {
            const response = await cb(...args);
            setData(response);
            setError(null);
        }  
        // if we get any error
        catch (error) {
            setError(error);
            toast.error(error.message);
            
        }
        finally{
            setLoading(false);
        }
    }

    return { data, loading, error, fn, setData };
};

export default useFetch;