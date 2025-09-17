import React from 'react'

interface VipMemberIconProps {
  isActive?: boolean
  className?: string
}

export const VipMemberIcon: React.FC<VipMemberIconProps> = ({ 
  isActive = false, 
  className = "w-5 h-5" 
}) => {
  const strokeColor = isActive ? "#ea9000" : "#fff"
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="23"
      viewBox="0 0 21 23"
      className={className}
    >
      <defs>
        <clipPath id="vip-clip">
          <rect
            width="21"
            height="23"
            fill="none"
          />
        </clipPath>
      </defs>
      <g id="network-connection" clipPath="url(#vip-clip)">
        <g
          id="network-connection-2"
          data-name="network-connection"
          transform="translate(-0.1 0.5)"
        >
          <line
            id="Line_1252"
            data-name="Line 1252"
            y1="3.29"
            x2="5.265"
            transform="translate(7.968 5.855)"
            fill="none"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="2"
          />
          <line
            id="Line_1253"
            data-name="Line 1253"
            x2="5.265"
            y2="3.29"
            transform="translate(7.968 12.855)"
            fill="none"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="2"
          />
          <circle
            id="Ellipse_1366"
            data-name="Ellipse 1366"
            cx="3.5"
            cy="3.5"
            r="3.5"
            transform="translate(13.1 0.5)"
            strokeWidth="2"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            fill="none"
          />
          <circle
            id="Ellipse_1367"
            data-name="Ellipse 1367"
            cx="3.5"
            cy="3.5"
            r="3.5"
            transform="translate(13.1 14.5)"
            strokeWidth="2"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            fill="none"
          />
          <circle
            id="Ellipse_1368"
            data-name="Ellipse 1368"
            cx="3.5"
            cy="3.5"
            r="3.5"
            transform="translate(1.1 7.5)"
            strokeWidth="2"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            fill="none"
          />
        </g>
      </g>
    </svg>
  )
}
