import "./Loading.css"

const Loading = ({ size = "medium", fullPage = false }) => {
  const sizeClass =
    {
      small: "spinner-small",
      medium: "spinner-medium",
      large: "spinner-large",
    }[size] || "spinner-medium"

  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className={`loading-spinner ${sizeClass}`}></div>
      </div>
    )
  }

  return <div className={`loading-spinner ${sizeClass}`}></div>
}

export default Loading
