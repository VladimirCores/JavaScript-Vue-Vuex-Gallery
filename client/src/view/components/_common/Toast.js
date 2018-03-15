const TIME = 3000
const POSITION = 'bottom-right'

const SETTINGS = {
  position: POSITION,
  duration: TIME
}

export const ConstructErrorToast = (toast) => {
  return function (message) {
    toast.error(message, SETTINGS)
  }
}

export const ConstructMessageToast = (toast) => {
  return function (message) {
    toast.success(message, SETTINGS)
  }
}

export const ConstructInfoToast = (toast) => {
  return function (message) {
    toast.info(message, SETTINGS)
  }
}

export default {
  ConstructMessageToast,
  ConstructInfoToast,
  ConstructErrorToast
}
