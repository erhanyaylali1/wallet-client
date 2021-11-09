export const capitalize = (str) => {
    if(str.includes("-")){
      const res = str.split('-')
      let result = ""
      res.forEach((el, index) => { 
        result += el.charAt(0).toUpperCase() + el.substring(1) 
        result += index !== res.length - 1 ? "-":""
      })
        return result
    }
    return str.charAt(0).toUpperCase() + str.substring(1)
}