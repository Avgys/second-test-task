export class ApiService {
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

  public static async DELETE(url: string) {
    return await this.SendRequest(() => fetch(url, {
      method: 'DELETE'
    }));
  }

  public static async PATCH(url: string, payload: any) {
    return await this.SendRequest(() => fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    }));
  }

  public static async POST(url: string, payload: any) {
    return await this.SendRequest(() => fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    }));
  }

  public static async GET(url: string) {
    return await this.SendRequest(() => fetch(url));
  }

  public static async SendRequest(requestAction: Function) : Promise<any | null> {
    try {
      const response = await requestAction();

      if (!response.ok) {
        console.error('Error:', `HTTP error! Status: ${response.status}`);
        return;
      }

      const contentType = response.headers.get("content-type")

      const result = await ((contentType && contentType.indexOf("application/json") !== -1)
        ? response.json()
        : response.text());

      console.log('Success:', result);
      return result;
    }
    catch (error) {
      console.error('Error:', error);
    }

    return null;
  }
}
