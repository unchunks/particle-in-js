// Movable 抽象クラス（基本の移動機能）
class Movable {
    constructor(x, y, minSpeed, maxSpeed) {
        if (new.target === Movable) {
            throw new Error("Cannot instantiate abstract class Movable directly.");
        }
        this.x = x;
        this.y = y;
        // 進行方向
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        this.speedX = Math.cos(this.angle) * this.speed;
        this.speedY = Math.sin(this.angle) * this.speed;
    }

    update(canvasWidth, canvasHeight) {
        throw new Error("Method 'update()' must be implemented.");
    }
}

// 直線的に動くクラス
class StraightMovable extends Movable {
    constructor(x, y, minSpeed, maxSpeed) {
        super(x, y, minSpeed, maxSpeed);
    }

    update(canvasWidth, canvasHeight) {
        this.x += this.speedX;
        this.y += this.speedY;
        // 画面端で跳ね返る
        if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.speedY *= -1;
    }
}

// ジグザグに動くクラス
class ZigzagMovable extends Movable {
    constructor(x, y, minSpeed, maxSpeed) {
        super(x, y, minSpeed, maxSpeed);
        this.centerX = x;
        this.centerY = y;
        // 正弦波運動の振幅
        this.amplitude = this.speed ** 2;
        // 正弦波の周波数
        this.frequency = Math.random() / 3;
        this.theta = 0;
    }

    update(canvasWidth, canvasHeight) {
        // 中心位置を更新
        this.centerX += this.speedX;
        this.centerY += this.speedY;

        // 正弦波の計算
        this.d = Math.cos(this.theta) * this.amplitude;
        this.dx = -Math.sin(this.angle) * this.d;
        this.dy = Math.cos(this.angle) * this.d;

        // 座標を更新
        this.x = this.centerX + this.dx;
        this.y = this.centerY + this.dy;

        // 正弦波の角度を少しずつ進める（周期的に動かすため）
        this.theta += this.frequency;

        // 画面端で跳ね返る処理
        if (this.x < 0 || this.x > canvasWidth) {
            this.dx *= -1; // x方向で跳ね返る
        }
        if (this.y < 0 || this.y > canvasHeight) {
            this.dy *= -1; // y方向で跳ね返る
        }
    }
}

// 円を描くように動くクラス
class CircularMovable extends Movable {
    constructor(x, y, minSpeed, maxSpeed) {
        super(x, y, minSpeed, maxSpeed);
        this.centerX = x;
        this.centerY = y;
        // 移動円の半径
        this.radius = Math.random() * 5 + 5;
    }

    update(canvasWidth, canvasHeight) {
        this.angle += this.speed / 30; // 回転の速さを調整
        this.x = this.centerX + Math.cos(this.angle) * this.radius;
        this.y = this.centerY + Math.sin(this.angle) * this.radius;
    }
}

// モジュールとしてエクスポート
export { Movable, StraightMovable, ZigzagMovable, CircularMovable };
