import { useSession } from "../../../auth/useSession";
import type { Tokens } from "../../../auth/storage";
import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

// // Auth
// const { getSession } = useSession();
// const pageSize = 10;

// const getAllFigmaProjects = async (page_param, page_size) => {
//     return await fetch("https://api.uidesign.ai/data/v3/public/bravo/projects/", {
//         method: "GET",
//         headers: {
//             'Accept': 'application/json'
//         }
//     })
// }

// let projects_data = await getAllFigmaProjects(1, pageSize).body.json();
// console.log("projects_data", projects_data.results);

const FigmaProjects = () => {
    return (
        <div>Hello Figma Projects</div>
    )
}

export default FigmaProjects;