
import axios from "axios"
import qs from 'qs'
import { CLIENT_SECRET_PASSWORD, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL } from "../utils/getEnv"

interface GoogleTokensResult {
    access_token : string;
    expires_in :Number;
    refresh_token: string;
    scope : string;
    id_token:string;
}

interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

export const getGoogleOAuth =async ({code}:{code:string}) :Promise<GoogleTokensResult> => {
    const url = 'https://oauth2.googleapis.com/token'

    const values = {
        code,
        client_id : GOOGLE_CLIENT_ID,
        client_secret : CLIENT_SECRET_PASSWORD,
        redirect_uri :GOOGLE_REDIRECT_URL,
        grant_type : 'authorization_code'
    }

    try{
        const res = await axios.post<GoogleTokensResult>(url, qs.stringify(values),{
            headers :{
                'Content-Type' : 'application/x-www-form-urlencoded',
            },
        })
        return res.data
    }catch(error : any){
        console.error(error, "failed to fetch Google Oauth Tokens")
        throw new Error(error.message)
    }
}

export const getGoogleUser = async ({id_token, access_token}:{id_token:string, access_token:string}) :Promise<GoogleUserResult> => {
    try{
        const res = await axios.get<GoogleUserResult>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,{
            headers :{
                Authorization : `Bearer ${id_token}`
            }
        })

        return res.data;

    }catch(error : any){
        console.error(error , "Failed to fetch Google user")
        throw new Error(error.message)
    }
}

// export const findAndUpdateUser = (query, update, options) =>{

// }