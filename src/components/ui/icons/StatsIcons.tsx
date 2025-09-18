import React from 'react'

interface IconProps {
  className?: string
}

export const SavingsIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="49.009"
      height="55.129"
      viewBox="0 0 49.009 55.129"
      className={className}
    >
      <g id="savings" transform="translate(-4.441 -1)">
        <path
          id="Path_29852"
          data-name="Path 29852"
          d="M30.559,1A11.559,11.559,0,1,0,42.119,12.559,11.559,11.559,0,0,0,30.559,1Zm5.075,12.188-4.446,4.446a.889.889,0,0,1-1.257,0l-4.446-4.446a.889.889,0,0,1,0-1.257l4.446-4.446a.889.889,0,0,1,1.257,0l4.446,4.446A.889.889,0,0,1,35.634,13.188Z"
          transform="translate(-1.613)"
          fill="currentColor"
        />
        <path
          id="Path_29853"
          data-name="Path 29853"
          d="M19.367,49l1.459,11.67a.889.889,0,0,0,.882.779H39.492a.889.889,0,0,0,.882-.779L41.833,49Z"
          transform="translate(-1.654 -5.32)"
          fill="currentColor"
        />
        <path
          id="Path_29854"
          data-name="Path 29854"
          d="M53.149,32.773a15.086,15.086,0,0,0-23.314,4.239V28.95c-.3.019-.589.044-.889.044s-.594-.026-.889-.044v8.062A15.086,15.086,0,0,0,4.742,32.773a.889.889,0,0,0,0,1.334,15.056,15.056,0,0,0,19.339.513,13.3,13.3,0,0,1,3.93,8.6H18.276a.889.889,0,0,0-.882,1l.1.779H40.4l.1-.779a.889.889,0,0,0-.882-1H29.88a13.3,13.3,0,0,1,3.93-8.6,15.056,15.056,0,0,0,19.339-.513.889.889,0,0,0,0-1.334Z"
          transform="translate(0 -3.098)"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

export const BarGraphIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="43.525"
      height="40.623"
      viewBox="0 0 43.525 40.623"
      className={className}
    >
      <g id="bar-graph-profit" transform="translate(0 -1)">
        <path
          id="Path_29851"
          data-name="Path 29851"
          d="M42.074,38.722H40.623V2.451A1.451,1.451,0,0,0,39.173,1h-5.8a1.451,1.451,0,0,0-1.451,1.451V38.722h-5.8V14.058a1.451,1.451,0,0,0-1.451-1.451h-5.8a1.451,1.451,0,0,0-1.451,1.451V38.722h-5.8V25.664a1.451,1.451,0,0,0-1.451-1.451h-5.8A1.451,1.451,0,0,0,2.9,25.664V38.722H1.451a1.451,1.451,0,0,0,0,2.9H42.074a1.451,1.451,0,1,0,0-2.9Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
