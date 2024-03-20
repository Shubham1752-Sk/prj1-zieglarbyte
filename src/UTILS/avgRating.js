export default function GetAvgRating(ratingArr) {
  if (ratingArr?.length === 0) return 0
  console.log(ratingArr)
  const totalReviewCount = ratingArr?.reduce((acc, curr) => {
    acc += curr.rating
    return acc
  }, 0)

  console.log(totalReviewCount)
  const multiplier = Math.pow(10, 1)
  const avgReviewCount =
    Math.round((totalReviewCount / ratingArr?.length) * multiplier) / multiplier
  console.log(avgReviewCount)
  return avgReviewCount
}
