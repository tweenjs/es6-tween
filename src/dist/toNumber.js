export default function toNumber (val) {
  let floatedVal = parseFloat(val)
  return typeof floatedVal === 'number' && !isNaN(floatedVal) ? floatedVal : val
}
