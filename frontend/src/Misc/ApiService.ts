import URLConsts from "./URLConsts";

export class ApiService{
    // public static async Register(credentials: Credentials): Promise<RegisterResponse>{
    //     const responseSalt =  await this.GET(URLConsts.BACKEND_SALT_API);
    //     const passwordHash = HashPassword(credentials.password, responseSalt.salt);
    //     const payload : CredentialsModel = {
    //         Name: credentials.login,
    //         ClientPasswordHash: passwordHash,
    //         ClientSalt: responseSalt.salt
    //     };
    //     return await ApiService.POST(URLConsts.BACKEND_REGISTER_API, payload);
    // }

    // public static async POST(url: string, payload: any) {
        
    //     try{
    //       const response = await fetch(url, {
    //         method: 'POST',
    //         headers: {
    //           'Content-type': 'application/json'
    //         },
    //         body: JSON.stringify(payload)
    //       })
    
    //       if (!response.ok) {        
    //         console.error('Error:', `HTTP error! Status: ${response.status}`);
    //         return false;
    //       }
      
    //       const result = await response.json();
    //       console.log('Success:', result);
    //       return result;
    //     }
    //     catch (error) {
    //       console.error('Error:', error);
    //       return false;
    //     }
    // }

    public static async GET(url: string){
        try{
            const response = await fetch(url)
      
            if (!response.ok) {        
              console.error('Error:', `HTTP error! Status: ${response.status}`);
              return;
            }
        
            const result = await response.json();
            console.log('Success:', result);
            return result;
          }
          catch (error) {
            console.error('Error:', error);
          }
  
          return null;
    }
}