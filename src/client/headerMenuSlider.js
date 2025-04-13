import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./apiEndpoints";
const FetchVideos = async()=>{
        try {
          const response = await axiosClient.get(`https://retoolapi.dev/Ns1zKR/video-slides-section`);
          if (response.status == 200) {
           return response.data
          }
        } catch (error) {
          console.log(error);
        }
   
}
export default FetchVideos;