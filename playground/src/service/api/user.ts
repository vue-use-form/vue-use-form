export function checkUserIsAlreadyExist(): Promise<boolean> {
  return new Promise((resolve) => {
    const randomNum = Math.random() * 10
    if (randomNum < 5) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}
