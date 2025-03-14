// Movable 抽象クラス（基本の移動機能）
class Movable {
    constructor(x, y, speed) {
        if (new.target === Movable) {
            throw new Error("Cannot instantiate abstract class Movable directly.");
        }
        this.x = x;
        this.y = y;
        this.speedX = Math.random() * speed - speed / 2;
        this.speedY = Math.random() * speed - speed / 2;
        this.speed = speed;
    }

    update(canvasWidth, canvasHeight) {
        throw new Error("Method 'update()' must be implemented.");
    }
}

// 直線的に動くクラス
class StraightMovable extends Movable {
    constructor(x, y, speed) {
        super(x, y, speed);
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
    constructor(x, y, speed) {
        super(x, y, speed);
        // ランダムな方向を設定（0 ～ 360度）
        this.randomAngle = Math.random() * Math.PI * 2; // ランダムな方向（0～2π）
        this.centerX = x;
        this.centerY = y;
        this.angle = this.randomAngle; // 初期角度をランダムに設定
        this.amplitude = speed; // 正弦波運動の振幅として速度を使用
        this.frequency = 0.1; // 正弦波の周波数
    }

    update(canvasWidth, canvasHeight) {
        // 正弦波運動の計算（x, yの移動量を正弦波に基づいて計算）
        this.d = Math.sin(this.angle) * this.amplitude; // 正弦波の計算
        this.dx = this.d * Math.cos(this.randomAngle); // x方向の移動量
        this.dy = this.d * Math.sin(this.randomAngle); // y方向の移動量

        // 座標を更新
        this.x = this.centerX + this.dx;
        this.y = this.centerY + this.dy;

        // 正弦波の角度を少しずつ進める（周期的に動かすため）
        this.angle += this.frequency;

        // 画面端で跳ね返る処理
        if (this.x < 0 || this.x > canvasWidth) {
            this.dx *= -1; // x方向で跳ね返る
        }
        if (this.y < 0 || this.y > canvasHeight) {
            this.dy *= -1; // y方向で跳ね返る
        }

        // 中心位置を更新（ランダムな方向で動かす）
        this.centerX += this.speedX;
        this.centerY += this.speedY;
    }
}

// 円を描くように動くクラス
class CircularMovable extends Movable {
    constructor(x, y, speed) {
        super(x, y, speed);
        this.centerX = x;
        this.centerY = y;
        this.radius = Math.random() * 10 + 10; // 円の半径
        this.angle = Math.random() * Math.PI * 2; // 初期角度
    }

    update(canvasWidth, canvasHeight) {
        this.angle += this.speed / 50; // 回転の速さを調整
        // this.centerX += this.speedX;
        // this.centerY += this.speedY;
        this.x = this.centerX + Math.cos(this.angle) * this.radius;
        this.y = this.centerY + Math.sin(this.angle) * this.radius;
    }
}

// モジュールとしてエクスポート
export { Movable, StraightMovable, ZigzagMovable, CircularMovable };
