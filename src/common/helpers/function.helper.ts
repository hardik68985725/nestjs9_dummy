export function get_random_number(p_min_value: number, p_max_value: number) {
  return Math.floor(
    Math.random() * (p_max_value - p_min_value + 1) + p_min_value
  )
}
