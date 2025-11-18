# Public 폴더

이 폴더는 정적 파일(이미지, 아이콘 등)을 저장하는 곳입니다.

## 이미지 추가 방법

1. 이 폴더에 이미지 파일을 추가하세요 (예: `coffee-americano.jpg`)
2. 컴포넌트에서 다음과 같이 사용하세요:

```jsx
<img src="/coffee-americano.jpg" alt="아메리카노" />
```

또는

```jsx
<img src={`/images/${menu.imageUrl}`} alt={menu.name} />
```

## 권장 이미지 형식

- **형식**: JPG, PNG, WebP
- **크기**: 400x400px 이상 권장
- **파일명**: 소문자와 하이픈 사용 (예: `coffee-americano-ice.jpg`)

## 현재 상태

현재는 SVG로 생성된 커피 이미지를 사용하고 있습니다. 
실제 이미지 파일을 사용하려면 `MenuCard.jsx`에서 이미지 경로를 수정하세요.

