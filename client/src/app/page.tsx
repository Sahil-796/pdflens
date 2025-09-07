"use client"

import axios from "axios"
import { useEffect, useState } from "react";



const handleLogin: any = async () => {
  try {


        } catch (err) {
            
        }
}

export default function Page() {

  const [resp, setResp] = useState<any>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/ai/generate', {
          user_id: "sahil",
          iscontext: true,
          user_prompt: `write a document which has a project definition exactly like this - Many regions face water scarcity and unmonitored consumption. Reservoir levels, rainfall, crop demand, and population usage data are not integrated, leading to shortages and inefficient water allocation. use the db schema from context they are all like Table and such use all that schema exactly like it they are water related tables. and keep a sample image for er diagram section. use url https://i.ibb.co/W4q9rT33/er-krish.png`
        });
        setResp(response.data);
      } catch (err) {
        setResp("Error fetching data");
      }
    };

    fetchData();
  }, []);
  return (
    <div>
    {/*  //   <button
    //     onClick={handleLogin}
    //   > 
    //     Login with Google
    //   </button> */}

    {resp.document}
    
    </div>
  );
}