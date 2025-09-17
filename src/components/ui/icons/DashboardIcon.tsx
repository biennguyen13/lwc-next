import React from 'react'

interface DashboardIconProps {
  isActive?: boolean
  className?: string
}

export const DashboardIcon: React.FC<DashboardIconProps> = ({ 
  isActive = false, 
  className = "w-5 h-5" 
}) => {
  const fillColor = isActive ? "#ea9000" : "#fff"
  
  return (
    <svg
      id="speedometer"
      xmlns="http://www.w3.org/2000/svg"
      width="19.815"
      height="19.846"
      viewBox="0 0 19.815 16.846"
      className={className}
    >
      <path
        id="Path_30761"
        data-name="Path 30761"
        d="M9.995,9.995a2.226,2.226,0,0,0,0-3.149C9.125,5.978,1,1,1,1S5.978,9.125,6.846,9.995A2.226,2.226,0,0,0,9.995,9.995Z"
        transform="translate(0.484 0.484)"
        fill={fillColor}
      />
      <path
        id="Path_30762"
        data-name="Path 30762"
        d="M8.9,0a1.484,1.484,0,1,0,0,2.968A5.936,5.936,0,1,1,2.968,8.9,1.484,1.484,0,1,0,0,8.9,8.9,8.9,0,1,0,8.9,0Z"
        fill={fillColor}
      />
    </svg>
  )
}
