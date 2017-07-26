if (Array.isArray === undefined) {
  Array.isArray = (arrayLike) => {
    return arrayLike !== undefined && typeof arrayLike === 'object' && arrayLike.length && arrayLike.push !== undefined && arrayLike.splice !== undefined
  }
}
