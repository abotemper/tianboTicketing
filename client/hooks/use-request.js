import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
//如果中间有error，onsuccess 就call不到了，在signup里是传参，真正执行看doRequest
  const doRequest = async (props = {}) => {
     try{
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
     }catch(err){
      setErrors(
        <div className="alert alert-danger">
          <h4>WOW!</h4>
          <ul className="my-0">
            {err.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
        );
      
     }
  };

  return { doRequest, errors };
};