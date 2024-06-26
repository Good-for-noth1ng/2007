import React from 'react'

const usePopStackScreens = () => {
  const shouldRemoveStackScreens = React.useRef(false)

  const toggleShouldRemoveScreens = () => {
    shouldRemoveStackScreens.current  = !shouldRemoveStackScreens.current
  }
  return [shouldRemoveStackScreens, toggleShouldRemoveScreens]
}

export default usePopStackScreens