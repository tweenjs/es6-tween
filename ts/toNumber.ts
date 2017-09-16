export default function toNumber(val: any): any {
  const floatedVal = parseFloat(val)
  return typeof floatedVal === 'number' && !isNaN(floatedVal) ? floatedVal : val
}
