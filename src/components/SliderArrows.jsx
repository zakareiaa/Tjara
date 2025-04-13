export function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          right: "40px",
        }}
        onClick={onClick}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_333_15182)">
            <path d="M22 0C34.1312 0 44 9.86883 44 22C44 34.1312 34.1312 44 22 44C9.86883 44 0 34.1312 0 22C0 9.86883 9.86883 0 22 0ZM12.8333 23.8333H22V29.9952C22 31.2693 23.562 31.9092 24.475 31.0072L32.5747 23.012C33.1412 22.4528 33.1412 21.5472 32.5747 20.988L24.475 12.9928C23.562 12.0908 22 12.7307 22 14.0048V20.1667H12.8333C11.8213 20.1667 11 20.988 11 22C11 23.012 11.8213 23.8333 12.8333 23.8333Z" fill="#374856" />
          </g>
          <defs>
            <clipPath id="clip0_333_15182">
              <rect width="44" height="44" fill="white" transform="matrix(-1 0 0 1 44 0)" />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  }
  
  export function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          left: "40px",
        }}
        onClick={onClick}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_333_15186)">
            <path d="M22 0C9.86883 0 0 9.86883 0 22C0 34.1312 9.86883 44 22 44C34.1312 44 44 34.1312 44 22C44 9.86883 34.1312 0 22 0ZM31.1667 23.8333H22V29.9952C22 31.2693 20.438 31.9092 19.525 31.0072L11.4253 23.012C10.8588 22.4528 10.8588 21.5472 11.4253 20.988L19.525 12.9928C20.438 12.0908 22 12.7307 22 14.0048V20.1667H31.1667C32.1787 20.1667 33 20.988 33 22C33 23.012 32.1787 23.8333 31.1667 23.8333Z" fill="#374856" />
          </g>
          <defs>
            <clipPath id="clip0_333_15186">
              <rect width="44" height="44" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  }