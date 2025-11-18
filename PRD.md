#커피 주문 앱

## 1. 프로젝트 개요

### 1.1 프로젝트명

커피 주문 앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발 범위
- 주문하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프론트엔드: HTML, CSS, 리액트, 자바스크립트
- 백엔드: Node.js, Express
- 데이터베이스: PostgreSQL

## 3. 기본 사항
- 프론트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 커피 메뉴만 있음

## 4. 주문하기 화면 PRD

### 4.1 화면 개요
사용자가 커피 메뉴를 선택하고 장바구니에 담아 주문할 수 있는 메인 화면입니다.

### 4.2 화면 레이아웃

#### 4.2.1 헤더 영역
- **위치**: 화면 최상단
- **구성 요소**:
  - 좌측: "COZY" 로고 박스
    - 배경색: 다크 그린 (#색상 코드)
    - 텍스트: "COZY" (흰색)
    - 형태: 직사각형 박스
  - 우측: 네비게이션 버튼
    - "주문하기" 버튼
    - "관리자" 버튼
    - 두 버튼은 가로로 나란히 배치

#### 4.2.2 메뉴 아이템 영역
- **위치**: 헤더 아래, 장바구니 영역 위
- **레이아웃**: 메뉴 아이템 카드들이 가로로 나란히 배치 (그리드 레이아웃)
- **카드 구성 요소** (각 메뉴 아이템):
  1. **이미지 영역**
     - 상단에 위치
     - 플레이스홀더 이미지 (대각선 십자가 표시)
     - 흰색 배경의 직사각형 박스
  2. **메뉴명**
     - 이미지 아래 위치
     - 예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼"
  3. **가격**
     - 메뉴명 아래 위치
     - 형식: "X,XXX원" (천 단위 구분 기호 포함)
  4. **설명**
     - 가격 아래 위치
     - 기본 텍스트: "간단한 설명..."
  5. **옵션 선택 영역**
     - 설명 아래 위치
     - 체크박스 형태의 옵션들:
       - "샷 추가 (+500원)" - 체크 시 500원 추가
       - "시럽 추가 (+0원)" - 체크 시 0원 추가 (무료 옵션)
     - 각 옵션은 독립적으로 선택 가능
  6. **담기 버튼**
     - 카드 하단에 위치
     - 버튼 텍스트: "담기"
     - 배경색: 회색
     - 클릭 시 해당 메뉴가 장바구니에 추가됨

#### 4.2.3 장바구니 영역
- **위치**: 화면 하단
- **레이아웃**: 큰 직사각형 박스 형태
- **구성 요소**:
  1. **제목**
     - "장바구니" 텍스트
  2. **장바구니 아이템 목록**
     - 각 아이템은 다음 정보를 표시:
       - 메뉴명 및 선택된 옵션
         - 형식: "메뉴명 (옵션명) X 수량"
         - 예: "아메리카노(ICE) (샷 추가) X 1"
       - 아이템별 가격
         - 형식: "X,XXX원"
         - 옵션 가격이 포함된 최종 가격
  3. **총 금액**
     - 우측에 위치
     - 라벨: "총 금액"
     - 금액: "XX,XXX원" (굵은 글씨)
     - 모든 장바구니 아이템의 합계
  4. **주문하기 버튼**
     - 총 금액 아래 위치
     - 버튼 텍스트: "주문하기"
     - 배경색: 회색
     - 클릭 시 주문이 완료됨

### 4.3 기능 요구사항

#### 4.3.1 메뉴 표시
- 데이터베이스에서 메뉴 목록을 조회하여 화면에 표시
- 각 메뉴는 카드 형태로 표시
- 메뉴가 많을 경우 스크롤 가능하도록 구현

#### 4.3.2 옵션 선택
- 사용자는 각 메뉴의 옵션을 체크박스로 선택 가능
- 여러 옵션을 동시에 선택 가능
- 옵션 선택 시 가격이 실시간으로 반영되어야 함 (장바구니에 담을 때)

#### 4.3.3 장바구니 기능
- "담기" 버튼 클릭 시:
  - 선택된 메뉴와 옵션이 장바구니에 추가됨
  - 동일한 메뉴와 옵션 조합이 이미 장바구니에 있으면 수량이 증가
  - 장바구니에 없는 새로운 조합이면 새 항목으로 추가
- 장바구니 아이템 표시:
  - 메뉴명, 선택된 옵션, 수량, 가격을 표시
  - 각 아이템별 가격은 (기본 가격 + 옵션 가격) × 수량
- 총 금액 계산:
  - 모든 장바구니 아이템의 가격 합계를 실시간으로 계산하여 표시

#### 4.3.4 주문하기 기능
- "주문하기" 버튼 클릭 시:
  - 장바구니의 모든 아이템이 주문으로 전송됨
  - 주문이 성공적으로 완료되면 장바구니가 비워짐
  - 사용자에게 주문 완료 피드백 제공 (알림 또는 메시지)

#### 4.3.5 네비게이션
- "관리자" 버튼 클릭 시 관리자 화면으로 이동
- "주문하기" 버튼은 현재 화면이므로 활성화 상태 표시 (선택사항)

### 4.4 UI/UX 요구사항

#### 4.4.1 디자인 스타일
- 전체적으로 깔끔하고 미니멀한 디자인
- 배경색: 흰색
- 텍스트: 진한 회색
- 테두리: 진한 회색
- 포인트 컬러: 다크 그린 (COZY 로고)

#### 4.4.2 반응형 디자인
- 다양한 화면 크기에 대응 가능하도록 구현
- 모바일에서는 메뉴 카드가 세로로 배치되도록 조정

#### 4.4.3 사용자 피드백
- 버튼 클릭 시 시각적 피드백 제공 (호버 효과, 클릭 효과)
- 장바구니에 아이템이 추가될 때 시각적 피드백 제공
- 주문 완료 시 명확한 피드백 제공

### 4.5 데이터 구조

#### 4.5.1 메뉴 데이터
```javascript
{
  id: number,
  name: string,
  price: number,
  description: string,
  imageUrl: string (또는 null)
}
```

#### 4.5.2 옵션 데이터
```javascript
{
  id: number,
  menuId: number,
  name: string,
  price: number
}
```

#### 4.5.3 장바구니 아이템 데이터
```javascript
{
  menuId: number,
  menuName: string,
  basePrice: number,
  selectedOptions: Array<{
    optionId: number,
    optionName: string,
    optionPrice: number
  }>,
  quantity: number,
  totalPrice: number
}
```

### 4.6 API 요구사항

#### 4.6.1 메뉴 조회
- **엔드포인트**: `GET /api/menus`
- **응답**: 메뉴 목록 배열

#### 4.6.2 옵션 조회
- **엔드포인트**: `GET /api/menus/:menuId/options`
- **응답**: 해당 메뉴의 옵션 목록 배열

#### 4.6.3 주문 생성
- **엔드포인트**: `POST /api/orders`
- **요청 본문**: 
  ```javascript
  {
    items: Array<{
      menuId: number,
      options: Array<number>, // optionId 배열
      quantity: number
    }>
  }
  ```
- **응답**: 생성된 주문 정보

## 5. 관리자 화면 PRD

### 5.1 화면 개요
관리자가 주문 현황을 확인하고, 재고를 관리하며, 주문 상태를 변경할 수 있는 관리 화면입니다.

### 5.2 화면 레이아웃

#### 5.2.1 헤더 영역
- **위치**: 화면 최상단
- **구성 요소**:
  - 좌측: "COZY" 로고 박스
    - 배경색: 다크 그린 (#색상 코드)
    - 텍스트: "COZY" (흰색)
    - 형태: 직사각형 박스
  - 우측: 네비게이션 버튼
    - "주문하기" 버튼
    - "관리자" 버튼 (현재 활성화 상태 - 진한 테두리로 표시)
    - 두 버튼은 가로로 나란히 배치

#### 5.2.2 관리자 대시보드 영역
- **위치**: 헤더 아래, 첫 번째 섹션
- **레이아웃**: 연한 회색 배경의 둥근 모서리 박스
- **구성 요소**:
  1. **제목**
     - "관리자 대시보드" 텍스트
     - 섹션 상단에 위치
  2. **주문 통계 정보**
     - 한 줄로 표시되는 통계 요약
     - 형식: "총 주문 X / 주문 접수 X / 제조 중 X / 제조 완료 X"
     - 각 통계는 "/"로 구분
     - 예: "총 주문 1 / 주문 접수 1 / 제조 중 0 / 제조 완료 0"

#### 5.2.3 재고 현황 영역
- **위치**: 관리자 대시보드 아래
- **레이아웃**: 연한 회색 배경의 둥근 모서리 박스
- **구성 요소**:
  1. **제목**
     - "재고 현황" 텍스트
     - 섹션 상단에 위치
  2. **재고 카드 목록**
     - 메뉴별 재고 카드들이 가로로 나란히 배치
     - 각 카드 구성 요소:
       - **메뉴명**
         - 카드 상단에 위치
         - 예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼"
       - **재고 수량**
         - 메뉴명 아래 위치
         - 형식: "XX개"
         - 예: "10개"
       - **수량 조절 버튼**
         - 재고 수량 아래 위치
         - "+" 버튼: 재고 증가 (작은 정사각형 버튼)
         - "-" 버튼: 재고 감소 (작은 정사각형 버튼)
         - 두 버튼은 가로로 나란히 배치

#### 5.2.4 주문 현황 영역
- **위치**: 재고 현황 아래, 화면 하단
- **레이아웃**: 연한 회색 배경의 둥근 모서리 박스
- **구성 요소**:
  1. **제목**
     - "주문 현황" 텍스트
     - 섹션 상단에 위치
  2. **주문 목록**
     - 각 주문 항목은 다음 정보를 표시:
       - **주문 일시**
         - 형식: "X월 XX일 XX:XX"
         - 예: "7월 31일 13:00"
       - **주문 아이템**
         - 형식: "메뉴명 X 수량"
         - 예: "아메리카노(ICE) x 1"
       - **주문 금액**
         - 형식: "X,XXX원"
         - 예: "4,000원"
       - **주문 상태 액션 버튼**
         - 주문 상태에 따라 다른 버튼 표시
         - "주문 접수" 버튼: 대기 중인 주문에 표시
         - 버튼 클릭 시 주문 상태가 변경됨
  3. **주문 목록 스크롤**
     - 주문이 많을 경우 스크롤 가능하도록 구현

### 5.3 기능 요구사항

#### 5.3.1 관리자 대시보드
- **통계 조회**
  - 총 주문 수: 모든 주문의 총 개수
  - 주문 접수: 상태가 "주문 접수"인 주문 수
  - 제조 중: 상태가 "제조 중"인 주문 수
  - 제조 완료: 상태가 "제조 완료"인 주문 수
- **실시간 업데이트**
  - 주문 상태가 변경될 때마다 통계가 자동으로 업데이트
  - 페이지 로드 시 최신 통계 조회

#### 5.3.2 재고 관리
- **재고 조회**
  - 데이터베이스에서 각 메뉴의 현재 재고 수량을 조회하여 표시
- **재고 증가**
  - "+" 버튼 클릭 시:
    - 해당 메뉴의 재고 수량이 1 증가
    - 데이터베이스에 즉시 반영
    - 화면에 실시간으로 업데이트
- **재고 감소**
  - "-" 버튼 클릭 시:
    - 해당 메뉴의 재고 수량이 1 감소
    - 재고가 0 이하로 내려가지 않도록 검증 (0 이하일 경우 감소 불가)
    - 데이터베이스에 즉시 반영
    - 화면에 실시간으로 업데이트
- **재고 부족 알림** (선택사항)
  - 재고가 특정 수준 이하로 떨어지면 시각적 경고 표시

#### 5.3.3 주문 현황 관리
- **주문 목록 조회**
  - 데이터베이스에서 주문 목록을 조회하여 표시
  - 주문은 최신순으로 정렬 (최신 주문이 상단에 표시)
  - 주문 상태별로 필터링 가능 (선택사항)
- **주문 상태 변경**
  - "주문 접수" 버튼 클릭 시:
    - 주문 상태가 "주문 접수"로 변경됨
    - 버튼이 다음 상태로 변경됨 (예: "제조 시작")
  - 주문 상태 흐름:
    1. "대기 중" → "주문 접수" (주문 접수 버튼)
    2. "주문 접수" → "제조 중" (제조 시작 버튼)
    3. "제조 중" → "제조 완료" (제조 완료 버튼)
- **주문 상세 정보** (선택사항)
  - 주문 항목 클릭 시 상세 정보 표시 (옵션 포함)

#### 5.3.4 네비게이션
- "주문하기" 버튼 클릭 시 주문하기 화면으로 이동
- "관리자" 버튼은 현재 화면이므로 활성화 상태 표시

### 5.4 UI/UX 요구사항

#### 5.4.1 디자인 스타일
- 주문하기 화면과 일관된 디자인 스타일 유지
- 전체적으로 깔끔하고 미니멀한 디자인
- 배경색: 흰색
- 섹션 박스: 연한 회색 배경, 둥근 모서리
- 텍스트: 진한 회색
- 테두리: 진한 회색
- 포인트 컬러: 다크 그린 (COZY 로고)

#### 5.4.2 반응형 디자인
- 다양한 화면 크기에 대응 가능하도록 구현
- 모바일에서는 재고 카드와 주문 목록이 세로로 배치되도록 조정

#### 5.4.3 사용자 피드백
- 버튼 클릭 시 시각적 피드백 제공 (호버 효과, 클릭 효과)
- 재고 수량 변경 시 시각적 피드백 제공
- 주문 상태 변경 시 명확한 피드백 제공
- 데이터 저장 성공/실패 시 알림 표시

### 5.5 데이터 구조

#### 5.5.1 재고 데이터
```javascript
{
  menuId: number,
  menuName: string,
  stock: number
}
```

#### 5.5.2 주문 데이터
```javascript
{
  id: number,
  orderDate: string, // ISO 8601 형식 또는 Date 객체
  status: string, // "대기 중" | "주문 접수" | "제조 중" | "제조 완료"
  items: Array<{
    menuId: number,
    menuName: string,
    options: Array<{
      optionId: number,
      optionName: string
    }>,
    quantity: number,
    price: number
  }>,
  totalPrice: number
}
```

#### 5.5.3 대시보드 통계 데이터
```javascript
{
  totalOrders: number,
  receivedOrders: number,
  inProductionOrders: number,
  completedOrders: number
}
```

### 5.6 API 요구사항

#### 5.6.1 대시보드 통계 조회
- **엔드포인트**: `GET /api/admin/dashboard`
- **응답**: 
  ```javascript
  {
    totalOrders: number,
    receivedOrders: number,
    inProductionOrders: number,
    completedOrders: number
  }
  ```

#### 5.6.2 재고 조회
- **엔드포인트**: `GET /api/admin/inventory`
- **응답**: 재고 목록 배열
  ```javascript
  Array<{
    menuId: number,
    menuName: string,
    stock: number
  }>
  ```

#### 5.6.3 재고 수정
- **엔드포인트**: `PUT /api/admin/inventory/:menuId`
- **요청 본문**: 
  ```javascript
  {
    stock: number
  }
  ```
- **응답**: 수정된 재고 정보

#### 5.6.4 주문 목록 조회
- **엔드포인트**: `GET /api/admin/orders`
- **쿼리 파라미터** (선택사항):
  - `status`: 주문 상태로 필터링
- **응답**: 주문 목록 배열

#### 5.6.5 주문 상태 변경
- **엔드포인트**: `PUT /api/admin/orders/:orderId/status`
- **요청 본문**: 
  ```javascript
  {
    status: string // "주문 접수" | "제조 중" | "제조 완료"
  }
  ```
- **응답**: 업데이트된 주문 정보

## 6. 백엔드 개발 PRD

### 6.1 데이터 모델

#### 6.1.1 Menus (메뉴)
메뉴 정보를 저장하는 테이블입니다.

**필드:**
- `id` (Primary Key, Auto Increment): 메뉴 고유 ID
- `name` (VARCHAR, NOT NULL): 커피 메뉴 이름
  - 예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼"
- `description` (TEXT): 메뉴 설명
  - 예: "간단한 설명..."
- `price` (INTEGER, NOT NULL): 메뉴 기본 가격 (원 단위)
  - 예: 4000, 5000
- `image_url` (VARCHAR, NULLABLE): 메뉴 이미지 URL
  - 예: "/images/coffee-ice.jpg"
  - NULL 허용 (이미지가 없을 수 있음)
- `stock` (INTEGER, NOT NULL, DEFAULT 0): 재고 수량
  - 관리자 화면에서 표시 및 관리
  - 주문 시 자동으로 차감됨

**제약 조건:**
- `price`는 0 이상이어야 함
- `stock`은 0 이상이어야 함

#### 6.1.2 Options (옵션)
메뉴에 추가할 수 있는 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (Primary Key, Auto Increment): 옵션 고유 ID
- `menu_id` (Foreign Key → Menus.id, NOT NULL): 연결된 메뉴 ID
- `name` (VARCHAR, NOT NULL): 옵션 이름
  - 예: "샷 추가", "시럽 추가"
- `price` (INTEGER, NOT NULL, DEFAULT 0): 옵션 추가 가격 (원 단위)
  - 예: 500 (샷 추가), 0 (시럽 추가 - 무료)

**제약 조건:**
- `menu_id`는 Menus 테이블에 존재하는 ID여야 함
- `price`는 0 이상이어야 함

#### 6.1.3 Orders (주문)
주문 정보를 저장하는 테이블입니다.

**필드:**
- `id` (Primary Key, Auto Increment): 주문 고유 ID
- `order_date` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP): 주문 일시
  - ISO 8601 형식으로 저장
  - 예: "2024-07-31T13:00:00Z"
- `status` (VARCHAR, NOT NULL, DEFAULT '주문 접수'): 주문 상태
  - 가능한 값: "주문 접수", "제조 중", "제조 완료"
  - 기본값: "주문 접수"
- `total_price` (INTEGER, NOT NULL): 주문 총 금액 (원 단위)
  - 모든 주문 항목의 가격 합계

**제약 조건:**
- `status`는 지정된 값 중 하나여야 함
- `total_price`는 0보다 커야 함

#### 6.1.4 OrderItems (주문 항목)
주문에 포함된 각 메뉴 항목 정보를 저장하는 테이블입니다.

**필드:**
- `id` (Primary Key, Auto Increment): 주문 항목 고유 ID
- `order_id` (Foreign Key → Orders.id, NOT NULL): 연결된 주문 ID
- `menu_id` (Foreign Key → Menus.id, NOT NULL): 주문한 메뉴 ID
- `quantity` (INTEGER, NOT NULL): 주문 수량
- `item_price` (INTEGER, NOT NULL): 해당 항목의 단가 (옵션 포함)
  - (메뉴 기본 가격 + 선택된 옵션 가격 합계)

**제약 조건:**
- `order_id`는 Orders 테이블에 존재하는 ID여야 함
- `menu_id`는 Menus 테이블에 존재하는 ID여야 함
- `quantity`는 1 이상이어야 함
- `item_price`는 0보다 커야 함

#### 6.1.5 OrderItemOptions (주문 항목 옵션)
주문 항목에 선택된 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (Primary Key, Auto Increment): 레코드 고유 ID
- `order_item_id` (Foreign Key → OrderItems.id, NOT NULL): 연결된 주문 항목 ID
- `option_id` (Foreign Key → Options.id, NOT NULL): 선택된 옵션 ID

**제약 조건:**
- `order_item_id`는 OrderItems 테이블에 존재하는 ID여야 함
- `option_id`는 Options 테이블에 존재하는 ID여야 함
- 동일한 주문 항목에 같은 옵션이 중복으로 저장되지 않도록 제약 필요

### 6.2 데이터 스키마를 위한 사용자 흐름

#### 6.2.1 메뉴 조회 및 표시
**흐름:**
1. 사용자가 '주문하기' 화면에 접속
2. 프론트엔드에서 `GET /api/menus` API 호출
3. 백엔드가 데이터베이스의 `Menus` 테이블에서 모든 메뉴 정보 조회
4. 각 메뉴의 `id`, `name`, `description`, `price`, `image_url` 반환 (재고 수량 제외)
5. 프론트엔드가 받은 메뉴 정보를 화면에 카드 형태로 표시
6. 관리자 화면에서는 `GET /api/admin/inventory` API를 통해 `Menus` 테이블의 `stock` 정보도 함께 조회하여 재고 현황에 표시

**데이터 흐름:**
```
Menus 테이블 → API 응답 → 프론트엔드 화면 표시
```

#### 6.2.2 옵션 조회
**흐름:**
1. 사용자가 특정 메뉴 카드를 확인
2. 프론트엔드에서 `GET /api/menus/:menuId/options` API 호출
3. 백엔드가 `Options` 테이블에서 해당 `menu_id`와 일치하는 옵션들 조회
4. 옵션 정보(`id`, `name`, `price`) 반환
5. 프론트엔드가 체크박스 형태로 옵션 표시

**데이터 흐름:**
```
Options 테이블 (menu_id 필터링) → API 응답 → 프론트엔드 옵션 표시
```

#### 6.2.3 주문 생성 및 저장
**흐름:**
1. 사용자가 장바구니에서 '주문하기' 버튼 클릭
2. 프론트엔드에서 `POST /api/orders` API 호출
   - 요청 본문에 주문 항목 정보 전달 (메뉴 ID, 수량, 선택된 옵션 ID 배열)
3. 백엔드에서 주문 처리:
   a. `Orders` 테이블에 새 주문 레코드 생성
      - `order_date`: 현재 시간
      - `status`: "주문 접수"
      - `total_price`: 모든 항목의 가격 합계 계산
   b. 각 주문 항목에 대해:
      - `OrderItems` 테이블에 레코드 생성
      - 선택된 옵션에 대해 `OrderItemOptions` 테이블에 레코드 생성
   c. 주문된 메뉴의 재고 차감:
      - `Menus` 테이블에서 해당 메뉴의 `stock` 값 감소
      - 재고가 부족한 경우 에러 반환
4. 생성된 주문 정보 반환
5. 프론트엔드에서 주문 완료 피드백 표시 및 장바구니 비우기

**데이터 흐름:**
```
프론트엔드 주문 요청 → Orders 테이블 생성 → OrderItems 테이블 생성 → OrderItemOptions 테이블 생성 → Menus 테이블 재고 차감 → API 응답
```

#### 6.2.4 주문 현황 조회 및 상태 관리
**흐름:**
1. 관리자가 관리자 화면의 '주문 현황' 섹션 확인
2. 프론트엔드에서 `GET /api/admin/orders` API 호출
3. 백엔드가 `Orders` 테이블에서 모든 주문 조회
   - 관련된 `OrderItems`, `OrderItemOptions`, `Menus`, `Options` 정보도 JOIN하여 조회
4. 주문 목록을 최신순으로 정렬하여 반환
5. 프론트엔드가 주문 목록 표시 (주문 일시, 메뉴, 수량, 옵션, 금액, 상태)
6. 관리자가 주문 상태 변경 버튼 클릭
7. 프론트엔드에서 `PUT /api/admin/orders/:orderId/status` API 호출
8. 백엔드가 `Orders` 테이블에서 해당 주문의 `status` 필드 업데이트
9. 업데이트된 주문 정보 반환
10. 프론트엔드에서 주문 목록 갱신

**데이터 흐름:**
```
Orders 테이블 (JOIN 관련 테이블) → API 응답 → 프론트엔드 주문 목록 표시
관리자 상태 변경 요청 → Orders 테이블 status 업데이트 → API 응답 → 프론트엔드 갱신
```

### 6.3 API 설계

#### 6.3.1 메뉴 목록 조회
**엔드포인트**: `GET /api/menus`

**설명**: 데이터베이스에서 모든 커피 메뉴 목록을 조회하여 주문하기 화면에 표시합니다.

**요청:**
- 파라미터 없음

**응답:**
- **성공 (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "간단한 설명...",
      "price": 4000,
      "imageUrl": "/images/coffee-ice.jpg"
    },
    {
      "id": 2,
      "name": "아메리카노(HOT)",
      "description": "간단한 설명...",
      "price": 4000,
      "imageUrl": "/images/coffee-hot.jpg"
    }
  ]
  ```
- **에러 (500 Internal Server Error)**: 서버 오류 시

**비고:**
- 재고 수량(`stock`)은 응답에 포함하지 않음 (관리자 전용 정보)

#### 6.3.2 메뉴별 옵션 조회
**엔드포인트**: `GET /api/menus/:menuId/options`

**설명**: 특정 메뉴에 연결된 옵션 목록을 조회합니다.

**요청:**
- **경로 파라미터**:
  - `menuId` (number): 메뉴 ID

**응답:**
- **성공 (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "menuId": 1,
      "name": "샷 추가",
      "price": 500
    },
    {
      "id": 2,
      "menuId": 1,
      "name": "시럽 추가",
      "price": 0
    }
  ]
  ```
- **에러 (404 Not Found)**: 해당 메뉴 ID가 존재하지 않을 경우
- **에러 (500 Internal Server Error)**: 서버 오류 시

#### 6.3.3 주문 생성
**엔드포인트**: `POST /api/orders`

**설명**: 사용자가 장바구니에서 '주문하기' 버튼을 클릭하면 주문 정보를 데이터베이스에 저장하고, 주문된 메뉴의 재고를 차감합니다.

**요청:**
- **요청 본문**:
  ```json
  {
    "items": [
      {
        "menuId": 1,
        "options": [1],  // optionId 배열
        "quantity": 2
      },
      {
        "menuId": 2,
        "options": [3, 4],
        "quantity": 1
      }
    ]
  }
  ```

**처리 로직:**
1. 요청 본문 검증 (items 배열이 비어있지 않은지, 필수 필드 존재 여부)
2. 각 주문 항목에 대해:
   - 메뉴 존재 여부 확인
   - 선택된 옵션이 해당 메뉴에 속하는지 확인
   - 재고 수량 확인 (주문 수량이 재고보다 많으면 에러)
3. 총 주문 금액 계산:
   - 각 항목: (메뉴 가격 + 옵션 가격 합계) × 수량
   - 모든 항목의 합계
4. 트랜잭션 시작
5. `Orders` 테이블에 주문 레코드 생성
6. 각 주문 항목에 대해:
   - `OrderItems` 테이블에 레코드 생성
   - 선택된 각 옵션에 대해 `OrderItemOptions` 테이블에 레코드 생성
7. 각 주문 항목에 대해 `Menus` 테이블의 재고 차감
8. 트랜잭션 커밋
9. 생성된 주문 정보 반환

**응답:**
- **성공 (201 Created)**:
  ```json
  {
    "id": 1,
    "orderDate": "2024-07-31T13:00:00Z",
    "status": "주문 접수",
    "items": [
      {
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "options": [
          {
            "optionId": 1,
            "optionName": "샷 추가"
          }
        ],
        "quantity": 2,
        "price": 4500
      }
    ],
    "totalPrice": 9000
  }
  ```
- **에러 (400 Bad Request)**: 
  - 요청 본문이 유효하지 않을 경우
  - 재고가 부족할 경우
  - 존재하지 않는 메뉴 ID나 옵션 ID가 포함된 경우
- **에러 (500 Internal Server Error)**: 서버 오류 시

**비고:**
- 재고 차감은 원자적으로 처리되어야 함 (트랜잭션 사용)
- 재고가 부족한 경우 주문 생성 실패

#### 6.3.4 주문 정보 조회
**엔드포인트**: `GET /api/orders/:orderId`

**설명**: 주문 ID를 전달하면 해당 주문의 상세 정보를 반환합니다.

**요청:**
- **경로 파라미터**:
  - `orderId` (number): 주문 ID

**응답:**
- **성공 (200 OK)**:
  ```json
  {
    "id": 1,
    "orderDate": "2024-07-31T13:00:00Z",
    "status": "주문 접수",
    "items": [
      {
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "options": [
          {
            "optionId": 1,
            "optionName": "샷 추가",
            "optionPrice": 500
          }
        ],
        "quantity": 2,
        "price": 4500
      }
    ],
    "totalPrice": 9000
  }
  ```
- **에러 (404 Not Found)**: 해당 주문 ID가 존재하지 않을 경우
- **에러 (500 Internal Server Error)**: 서버 오류 시

#### 6.3.5 관리자 - 재고 조회
**엔드포인트**: `GET /api/admin/inventory`

**설명**: 관리자 화면에서 모든 메뉴의 재고 정보를 조회합니다.

**요청:**
- 파라미터 없음

**응답:**
- **성공 (200 OK)**:
  ```json
  [
    {
      "menuId": 1,
      "menuName": "아메리카노 (ICE)",
      "stock": 10
    },
    {
      "menuId": 2,
      "menuName": "아메리카노 (HOT)",
      "stock": 8
    },
    {
      "menuId": 3,
      "menuName": "카페라떼",
      "stock": 5
    }
  ]
  ```
- **에러 (500 Internal Server Error)**: 서버 오류 시

#### 6.3.6 관리자 - 재고 수정
**엔드포인트**: `PUT /api/admin/inventory/:menuId`

**설명**: 관리자가 재고 수량을 수동으로 증가 또는 감소시킵니다.

**요청:**
- **경로 파라미터**:
  - `menuId` (number): 메뉴 ID
- **요청 본문**:
  ```json
  {
    "stock": 10
  }
  ```

**처리 로직:**
1. 메뉴 존재 여부 확인
2. 재고 값 검증 (0 이상이어야 함)
3. `Menus` 테이블의 `stock` 필드 업데이트

**응답:**
- **성공 (200 OK)**:
  ```json
  {
    "menuId": 1,
    "menuName": "아메리카노 (ICE)",
    "stock": 10
  }
  ```
- **에러 (404 Not Found)**: 해당 메뉴 ID가 존재하지 않을 경우
- **에러 (400 Bad Request)**: 재고 값이 유효하지 않을 경우 (음수 등)
- **에러 (500 Internal Server Error)**: 서버 오류 시

#### 6.3.7 관리자 - 주문 목록 조회
**엔드포인트**: `GET /api/admin/orders`

**설명**: 관리자 화면의 '주문 현황'에 표시할 주문 목록을 조회합니다.

**요청:**
- **쿼리 파라미터** (선택사항):
  - `status` (string): 주문 상태로 필터링 ("주문 접수", "제조 중", "제조 완료")

**응답:**
- **성공 (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "orderDate": "2024-07-31T13:00:00Z",
      "status": "주문 접수",
      "items": [
        {
          "menuId": 1,
          "menuName": "아메리카노(ICE)",
          "options": [
            {
              "optionId": 1,
              "optionName": "샷 추가"
            }
          ],
          "quantity": 1,
          "price": 4500
        }
      ],
      "totalPrice": 4500
    }
  ]
  ```
- **비고**: 주문 목록은 `orderDate` 기준 내림차순 정렬 (최신순)

#### 6.3.8 관리자 - 주문 상태 변경
**엔드포인트**: `PUT /api/admin/orders/:orderId/status`

**설명**: 관리자가 주문 상태를 변경합니다 ("주문 접수" → "제조 중" → "제조 완료").

**요청:**
- **경로 파라미터**:
  - `orderId` (number): 주문 ID
- **요청 본문**:
  ```json
  {
    "status": "제조 중"
  }
  ```

**처리 로직:**
1. 주문 존재 여부 확인
2. 상태 값 검증 (유효한 상태 값인지 확인)
3. `Orders` 테이블의 `status` 필드 업데이트

**응답:**
- **성공 (200 OK)**:
  ```json
  {
    "id": 1,
    "orderDate": "2024-07-31T13:00:00Z",
    "status": "제조 중",
    "items": [...],
    "totalPrice": 4500
  }
  ```
- **에러 (404 Not Found)**: 해당 주문 ID가 존재하지 않을 경우
- **에러 (400 Bad Request)**: 유효하지 않은 상태 값일 경우
- **에러 (500 Internal Server Error)**: 서버 오류 시

#### 6.3.9 관리자 - 대시보드 통계 조회
**엔드포인트**: `GET /api/admin/dashboard`

**설명**: 관리자 대시보드에 표시할 주문 통계를 조회합니다.

**요청:**
- 파라미터 없음

**응답:**
- **성공 (200 OK)**:
  ```json
  {
    "totalOrders": 10,
    "receivedOrders": 3,
    "inProductionOrders": 2,
    "completedOrders": 5
  }
  ```
- **에러 (500 Internal Server Error)**: 서버 오류 시

**비고:**
- `totalOrders`: 모든 주문의 총 개수
- `receivedOrders`: 상태가 "주문 접수"인 주문 수
- `inProductionOrders`: 상태가 "제조 중"인 주문 수
- `completedOrders`: 상태가 "제조 완료"인 주문 수

### 6.4 데이터베이스 스키마 예시

#### 6.4.1 PostgreSQL DDL 예시

```sql
-- Menus 테이블
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    image_url VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders 테이블
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT '주문 접수' 
        CHECK (status IN ('주문 접수', '제조 중', '제조 완료')),
    total_price INTEGER NOT NULL CHECK (total_price > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderItems 테이블
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INTEGER NOT NULL REFERENCES menus(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    item_price INTEGER NOT NULL CHECK (item_price > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderItemOptions 테이블
CREATE TABLE order_item_options (
    id SERIAL PRIMARY KEY,
    order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES options(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(order_item_id, option_id)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_options_menu_id ON options(menu_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);
CREATE INDEX idx_order_item_options_order_item_id ON order_item_options(order_item_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date DESC);
```

### 6.5 에러 처리

#### 6.5.1 공통 에러 응답 형식
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": "상세 정보 (선택사항)"
  }
}
```

#### 6.5.2 주요 에러 코드
- `400 Bad Request`: 잘못된 요청 (유효하지 않은 데이터, 재고 부족 등)
- `404 Not Found`: 리소스를 찾을 수 없음 (존재하지 않는 ID)
- `500 Internal Server Error`: 서버 내부 오류

### 6.6 보안 고려사항

- CORS 설정: 프론트엔드 도메인만 허용
- 입력 데이터 검증: SQL Injection 방지
- 트랜잭션 사용: 데이터 일관성 보장
- 재고 차감 시 동시성 제어: Race Condition 방지