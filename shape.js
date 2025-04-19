// Shape クラス（仮想クラス）
class Shape {
    constructor(sizeMin, sizeMax, damping) {
        if (new.target === Shape) {
            throw new Error("Cannot instantiate abstract class Shape directly.");
        }
        this.size = Math.random() * (sizeMax - sizeMin) + sizeMin;

        // 色を変化させるための変数
        this.hue = Math.random() * 360;
        this.color = `hsl(${this.hue}, 100%, 50%)`;

        this.damping = damping;
    }

    update() {
        // サイズが小さくなりすぎないようにする
        this.size = Math.max(0, this.size - this.damping);

        // 色相を変化させる
        this.hue += 0;
        this.color = `hsl(${this.hue}, 100%, 50%)`;
    }

    draw(ctx, x, y) {
        throw new Error("Method 'draw()' must be implemented.");
    }
}

// Circle クラス（円）
class Circle extends Shape {
    constructor(sizeMin, sizeMax, damping) {
        super(sizeMin, sizeMax, damping);
    }

    draw(ctx, x, y) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

// Triangle クラス（三角形）
class Triangle extends Shape {
    constructor(sizeMin, sizeMax, damping) {
        super(sizeMin, sizeMax, damping);
    }

    draw(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x, y - this.size); // 上の頂点
        ctx.lineTo(x - this.size * Math.sqrt(3) / 2, y + this.size / 2); // 左下の頂点
        ctx.lineTo(x + this.size * Math.sqrt(3) / 2, y + this.size / 2); // 右下の頂点
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Square クラス（四角形）
class Square extends Shape {
    constructor(sizeMin, sizeMax, damping) {
        super(sizeMin, sizeMax, damping);
    }

    draw(ctx, x, y) {
        ctx.fillStyle = this.color;
        ctx.fillRect(x - this.size, y - this.size, this.size * 2, this.size * 2);
    }
}

// Star クラス（星形）
class Star extends Shape {
    constructor(sizeMin, sizeMax, damping) {
        super(sizeMin, sizeMax, damping);
    }

    draw(ctx, x, y) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // 角の数
        const spikes = 5;
        // 外接円の半径
        const outerRadius = this.size;
        // 内接円の半径
        const innerRadius = this.size / 2;
        // 描き始めの角度
        let rotation = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        
        // 上の角からスタート
        ctx.moveTo(x + Math.cos(rotation) * outerRadius, y + Math.sin(rotation) * outerRadius);
        for (let i = 0; i < spikes; i++) {
            rotation += step;
            let x1 = x + Math.cos(rotation) * innerRadius;
            let y1 = y + Math.sin(rotation) * innerRadius;
            ctx.lineTo(x1, y1);

            rotation += step;
            let x2 = x + Math.cos(rotation) * outerRadius;
            let y2 = y + Math.sin(rotation) * outerRadius;
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
    }
}

// Heart クラス（ハート形）
class Heart extends Shape {
    constructor(sizeMin, sizeMax, damping) {
        super(sizeMin, sizeMax, damping);
    }

    draw(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x, y + this.size);
        ctx.bezierCurveTo(
            x            , y + this.size / 2,
            x - this.size, y + this.size / 4,
            x - this.size, y - this.size / 2,
        );
        ctx.bezierCurveTo(
            x - this.size, y - this.size * 1.2,
            x, y - this.size,
            x, y - this.size / 2
        );

        ctx.bezierCurveTo(
            x, y - this.size,
            x + this.size, y - this.size * 1.2,
            x + this.size, y - this.size / 2
        );
        ctx.bezierCurveTo(
            x + this.size, y + this.size / 4,
            x            , y + this.size / 2,
            x, y + this.size
        );
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Custom クラス
class Custom extends Shape {
    constructor(sizeMin, sizeMax, damping) {
        super(sizeMin, sizeMax, damping);
    }

    draw(ctx, x, y) {   // x と y は、図形の中心座標です
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~自由に書き換えてみてね~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // 変数の定義
        let radian = this.size; // this.size は図形の外接円の半径です

        // 必須　描画パスの指定開始
        ctx.beginPath();


        // 描き始めを設定
        ctx.moveTo(
            x,          // 移動先のX座標
            y           // 移動先のY座標
        );

        // 線を描く
        ctx.lineTo(
            x,          // 移動先のX座標
            y           // 移動先のY座標
        );

        // 弧を描く
        ctx.arc(
            x,          // 中心座標のX座標
            y,          // 中心座標のY座標
            radian,     // 半径
            0,          // 描き始めの角度（ラジアン）
            Math.PI / 2,    // 描き終わりの角度（ラジアン）
            true        // trueだと反時計回り、falseだと時計回りに描き進める
        );

        // ベジェ曲線を描く
        ctx.bezierCurveTo(
            x, y,       // 制御点1の座標
            x, y,       // 制御点2の座標
            x, y,       // 終点の座標
        );


        // 必須　描画パスの指定終了
        ctx.closePath();

        ctx.fillStyle = this.color;     // 塗りつぶす色（this.colorはランダムな色を設定しています）
        // 以下のように色を指定することもできます
        // ctx.fillStyle = "orange";
        // ctx.fillStyle = "#FFA500";
        // ctx.fillStyle = "rgb(255 165 0)";
        // ctx.fillStyle = "rgb(255 165 0 / 100%)";    // 最後の100%は不透明度
        // ctx.fillRect = "hsl(38, 100%, 50%)";
        ctx.fill();                     // 塗りつぶしを実行

        ctx.lineWidth = 1;              // 線の太さ
        ctx.strokeStyle = 'white'       // 線の色
        ctx.stroke();                   // 枠線の描画を実行
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ここまで~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}


// モジュールとしてエクスポート
export { Shape, Circle, Triangle, Square, Star, Heart, Custom };
