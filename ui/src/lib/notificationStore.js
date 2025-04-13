import { create } from "zustand";
import apiRequest from "./apiRequest";
import axios from "axios";

const token = localStorage.getItem("token")

export const useNotificationStore = create((set) => ({
  number: 0,
  
  fetch: async () => {
    const res = await axios.get(`http://localhost:8800/api/users/notification`, 
     {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials:true,
   
    }
    );
    set({ number: res.data });
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
