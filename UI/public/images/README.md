# 이미지 폴더

이 폴더에 커피 메뉴 이미지를 추가하세요.

## 필요한 이미지 파일

다음 이미지 파일들을 이 폴더에 추가하세요:

1. **coffee-ice.jpg** - 아이스커피 이미지 (아메리카노 ICE용)
2. **coffee-hot.jpg** - 핫 커피 머그잔 이미지 (아메리카노 HOT용)
3. **coffee-latte.jpg** - 라떼/카푸치노 이미지 (라떼, 카푸치노, 바닐라라떼, 카라멜마키아토용)

## 이미지 추가 방법

1. 이미지 파일을 이 폴더(`UI/public/images/`)에 복사하세요.
2. 파일명을 위의 이름과 동일하게 맞춰주세요.
3. 또는 `OrderPage.jsx` 파일에서 `imageUrl` 경로를 수정하세요.

## 온라인 이미지 URL 사용

로컬 파일 대신 온라인 이미지 URL을 사용하려면 `OrderPage.jsx`의 `menuData`에서 `imageUrl`을 다음과 같이 수정하세요:

```javascript
{
  id: 1,
  name: '아메리카노(ICE)',
  price: 4000,
  description: '간단한 설명...',
  imageUrl: 'https://example.com/images/coffee-ice.jpg'
}
```

## 권장 이미지 사양

- **형식**: JPG, PNG, WebP
- **크기**: 400x400px 이상 권장
- **비율**: 1:1 (정사각형) 권장

