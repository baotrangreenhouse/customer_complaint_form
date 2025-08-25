"use client"
import { FormInputData_Type } from "@/types/type";
import { useEffect, useState } from "react";
import { getComplaint } from "./actions/getComplaint";


const Home = () => {
  const [complaints, setComplaints] = useState<FormInputData_Type[]>([]);

  useEffect(() => {
    const getData = async () => {
      const {status, data, error} = await getComplaint();
    }
    getData();
  }, [])

  return (
    <section>

    </section>
  )
}

export default Home;