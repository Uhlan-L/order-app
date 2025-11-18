// 커피 메뉴별 SVG 이미지 컴포넌트
function CoffeeImage({ menuName }) {
  // 메뉴명에 따라 다른 색상의 커피 이미지 생성
  const getCoffeeColor = (name) => {
    if (name.includes('아메리카노')) {
      return '#8B4513'; // 갈색
    } else if (name.includes('라떼') || name.includes('카푸치노')) {
      return '#D2B48C'; // 베이지색
    } else if (name.includes('카라멜')) {
      return '#CD853F'; // 카라멜색
    } else {
      return '#6F4E37'; // 기본 커피색
    }
  };

  const coffeeColor = getCoffeeColor(menuName);
  const isHot = menuName.includes('HOT');

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ backgroundColor: '#f5f5f5' }}
    >
      {/* 커피 컵 */}
      <ellipse cx="100" cy="160" rx="60" ry="20" fill="#E8E8E8" />
      <path
        d="M 60 160 Q 60 80 100 80 Q 140 80 140 160"
        fill={coffeeColor}
        stroke="#D0D0D0"
        strokeWidth="2"
      />
      
      {/* 커피 표면 */}
      <ellipse cx="100" cy="80" rx="40" ry="8" fill={isHot ? '#8B4513' : '#4A90E2'} />
      
      {/* 증기 (HOT인 경우) */}
      {isHot && (
        <>
          <path
            d="M 85 70 Q 85 50 80 40"
            stroke="#CCCCCC"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 100 70 Q 100 50 105 40"
            stroke="#CCCCCC"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 115 70 Q 115 50 110 40"
            stroke="#CCCCCC"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
      
      {/* 얼음 (ICE인 경우) */}
      {!isHot && (
        <>
          <circle cx="90" cy="90" r="4" fill="#E0F2FE" opacity="0.8" />
          <circle cx="110" cy="95" r="3" fill="#E0F2FE" opacity="0.8" />
          <circle cx="95" cy="100" r="3.5" fill="#E0F2FE" opacity="0.8" />
        </>
      )}
      
      {/* 컵 손잡이 */}
      <path
        d="M 140 100 Q 160 100 160 120 Q 160 140 140 140"
        fill="none"
        stroke="#D0D0D0"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default CoffeeImage;

