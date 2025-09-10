import React from "react"

interface USDTIconProps {
  className?: string
  size?: number
}

export function USDTIcon({ className = "", size = 24 }: USDTIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 44 42" 
      className={className}
    >
      <defs>
        <linearGradient 
          id="usdt-gradient" 
          x1="0.839" 
          y1="0.087" 
          x2="0.292" 
          y2="0.904" 
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#3db190" />
          <stop offset="1" stopColor="#1a8b63" />
        </linearGradient>
      </defs>
      <g transform="translate(-3690 1206)">
        <g transform="translate(-344 1299)">
          <rect 
            width="44" 
            height="42" 
            rx="5" 
            transform="translate(4034 -2505)" 
            fill="url(#usdt-gradient)"
          />
        </g>
        <g transform="translate(3695.735 -1202.165)">
          <path 
            d="M19.444,17.636v0c-.124.009-.766.048-2.2.048-1.142,0-1.946-.034-2.229-.048v0c-4.4-.193-7.679-.959-7.679-1.875s3.282-1.681,7.679-1.877v2.99c.287.02,1.111.069,2.248.069,1.365,0,2.049-.057,2.177-.068V13.887c4.388.2,7.662.961,7.662,1.875s-3.274,1.68-7.662,1.874m0-4.06V10.9h6.123V6.819H8.9V10.9h6.123v2.675C10.042,13.8,6.3,14.789,6.3,15.97s3.742,2.166,8.719,2.4V26.94h4.426V18.363c4.968-.228,8.7-1.214,8.7-2.393s-3.733-2.165-8.7-2.394" 
            fill="#fff"
          />
        </g>
      </g>
    </svg>
  )
}
