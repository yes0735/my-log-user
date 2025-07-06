
export function useCommon() {
    const formatDate = (isoString) => {
      return isoString?.slice(0, 10)
    }
  
    const isEmpty = (value) => {
      return value === null || value === undefined || value === ''
    }
  
    const capitalize = (text) => {
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
    }
  
    return {
      formatDate,
      isEmpty,
      capitalize
    }
  }