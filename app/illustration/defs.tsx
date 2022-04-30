export default function Defs() {
  return (
    <defs>
      {/* Main bg gradient */}
      <linearGradient
        id="bg-color"
        x1="756"
        y1="-39.4623"
        x2="762.208"
        y2="593.406"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset="0.101475"
          style={{ stopColor: "var(--color-sky-stop)" }}
        />
        <stop
          offset="0.226167"
          style={{ stopColor: "var(--color-sky-stop-2)" }}
        />
        <stop
          offset="0.439546"
          stopOpacity="1"
          style={{ stopColor: "var(--color-sky-stop-3)" }}
        />
        <stop
          offset="0.562886"
          stopOpacity="1"
          style={{ stopColor: "var(--color-sky-stop-4)" }}
        />
        <stop
          offset="0.822057"
          style={{ stopColor: "var(--color-sky-stop-5)" }}
        />
      </linearGradient>

      {/* Mountain */}
      <filter
        id="mountains"
        x="-16"
        y="0"
        width="1585"
        height="431"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="0.5"
          result="effect1_foregroundBlur_315_338"
        />
      </filter>
      <linearGradient
        id="paint0_linear_315_338"
        x1="666.265"
        y1="-52.6518"
        x2="672.307"
        y2="601.849"
        gradientUnits="userSpaceOnUse"
      >
        <stop style={{ stopColor: "var(--color-hill-stop)" }} />
        <stop
          offset="0.00502597"
          style={{ stopColor: "var(--color-hill-stop-2)" }}
        />
        <stop
          offset="0.110678"
          style={{ stopColor: "var(--color-hill-stop-3)" }}
        />
        <stop
          offset="0.421642"
          style={{ stopColor: "var(--color-hill-stop-4)" }}
        />
        <stop
          offset="0.517613"
          style={{ stopColor: "var(--color-hill-stop-5)" }}
        />
        <stop
          offset="0.681571"
          style={{ stopColor: "var(--color-hill-stop-6)" }}
        />
      </linearGradient>

      {/* Celestial */}
      <filter
        id="filter0_f_315_339"
        x="0"
        y="0"
        width="154"
        height="154"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
      </filter>

      <radialGradient
        id="celestial"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(165.5 152) rotate(-133.413) scale(197.889 164.972)"
      >
        <stop
          offset="0.145833"
          style={{ stopColor: "var(--color-celestial-stop)" }}
          stopOpacity="0.85"
        />
        <stop
          offset="0.522127"
          style={{ stopColor: "var(--color-celestial-stop-2)" }}
          stopOpacity="0.97"
        />
        <stop
          offset="0.634878"
          style={{ stopColor: "var(--color-celestial-stop-3)" }}
          stopOpacity="0.99"
        />
        <stop
          offset="0.754072"
          style={{ stopColor: "var(--color-celestial-stop-4)" }}
        />
        <stop
          offset="0.8683"
          style={{ stopColor: "var(--color-celestial-stop-5)" }}
          stopOpacity="0.95"
        />
        <stop
          offset="1"
          style={{ stopColor: "var(--color-celestial-stop-6)" }}
          stopOpacity="0.84"
        />
      </radialGradient>

      {/* Man */}
      <linearGradient
        id="paint0_linear_320_673"
        x1="34.9798"
        y1="104.485"
        x2="34.261"
        y2="116.705"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#002922" />
        <stop offset="1" stopColor="#002922" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_320_673"
        x1="31.2795"
        y1="99.3491"
        x2="31.2795"
        y2="132.825"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#013E33" />
        <stop offset="1" stopColor="#013E33" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_320_673"
        x1="48.1699"
        y1="105.593"
        x2="51.2782"
        y2="138.925"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#013E33" />
        <stop offset="1" stopColor="#013E33" stopOpacity="0" />
      </linearGradient>

      {/* Campfire */}
      <filter
        id="filter0_d_334_616"
        x="17.6719"
        y="81.5938"
        width="17.8477"
        height="17.4062"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_d_334_616"
        x="31.0664"
        y="79.75"
        width="18.793"
        height="15.3438"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter2_d_334_616"
        x="23.4844"
        y="79.166"
        width="18.5059"
        height="17.6855"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter3_d_334_616"
        x="9.19727"
        y="82.7676"
        width="23.5312"
        height="20.6641"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter4_d_334_616"
        x="44.9062"
        y="80.3027"
        width="17.0996"
        height="16.1777"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter5_d_334_616"
        x="38.9375"
        y="80.9199"
        width="17.0488"
        height="14.9453"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter6_d_334_616"
        x="51.0059"
        y="79.8477"
        width="19.4258"
        height="17.2363"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter7_d_334_616"
        x="58.334"
        y="81.9629"
        width="18.6523"
        height="15.5547"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter8_d_334_616"
        x="64.0234"
        y="81.3672"
        width="29.1816"
        height="26.0957"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter9_d_334_616"
        x="0.744141"
        y="89.9883"
        width="23.877"
        height="17.8438"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter10_d_334_616"
        x="14.0039"
        y="98.4707"
        width="26.3301"
        height="19.5254"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter11_d_334_616"
        x="6.37109"
        y="92.3809"
        width="23.9785"
        height="23.4902"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter12_d_334_616"
        x="60.4434"
        y="87.5938"
        width="26.7539"
        height="27.2109"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter13_d_334_616"
        x="50.957"
        y="95.9336"
        width="23.5195"
        height="22.3594"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
      <filter
        id="filter14_d_334_616"
        x="27.7539"
        y="98.0273"
        width="36.1738"
        height="23.8691"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_334_616"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_334_616"
          result="shape"
        />
      </filter>
    </defs>
  );
}
