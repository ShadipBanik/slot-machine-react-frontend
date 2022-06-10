
export const setLocalstorage=(key,value)=>{
   localStorage.setItem(key,JSON.stringify(value))
}

export const getLocalstorage=(key)=>{
   return localStorage.getItem(key)
}
export const deleteLocalstorage=(key)=>{
  localStorage.removeItem(key)
}
