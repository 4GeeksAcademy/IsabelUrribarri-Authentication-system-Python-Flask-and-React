import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.accessToken) {
            navigate("/login");
        } else {
            actions.getUser();
        }
    }, []);

    return (
        <div>
            Hello Traveler!
        </div>
    );
};
