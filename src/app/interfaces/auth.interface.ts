export interface Login {
  email: string,
  password: string
}

export interface LoginResponse{
  code?: string,
  success?: boolean,
  data?: LoginData,
  message?: string
}

export interface User{
  user_id: number,
  user: string,
  email: string
}

interface LoginData extends User{
  access_token: string,
  token_type: string,
  expires_in: number
}
