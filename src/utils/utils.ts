import _ from "lodash"

export const multipleMax = (arr: any[], compare: string) => {
  var groups = _.groupBy(arr, compare)
  var keys = _.keys(groups)
  var max = _.max(keys) || ""
  return groups[max]
}
