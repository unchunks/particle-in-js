// Shape クラス（仮想クラス）
class Shape {
    constructor(sizeMin, sizeMax, damping) {
        if (new.target === Shape) {
            throw new Error("Cannot instantiate abstract class Shape directly.");
        }
        this.size = Math.random() * (sizeMax - sizeMin) + sizeMin;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.damping = damping;
    }

    update() {
        // サイズが小さくなりすぎないようにする
        this.size = Math.max(0.2, this.size - this.damping);
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
        ctx.fill();
    }
}

// Triangle クラス（三角形）
class Triangle extends Shape {
    constructor(sizeMin, sizeMax, damping) {
        super(sizeMin, sizeMax, damping);
    }

    draw(ctx, x, y) {
        const height = Math.sqrt(3) / 2 * this.size; // 三角形の高さ
        ctx.beginPath();
        ctx.moveTo(x, y - height / 2); // 上の頂点
        ctx.lineTo(x - this.size / 2, y + height / 2); // 左下の頂点
        ctx.lineTo(x + this.size / 2, y + height / 2); // 右下の頂点
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
        ctx.fillRect(x - this.size / 2, y - this.size / 2, this.size, this.size);
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
        const spikes = 5;
        const outerRadius = this.size;
        const innerRadius = this.size / 2;
        let rotation = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        
        ctx.moveTo(x, y - outerRadius);
        for (let i = 0; i < spikes; i++) {
            let x1 = x + Math.cos(rotation) * outerRadius;
            let y1 = y + Math.sin(rotation) * outerRadius;
            ctx.lineTo(x1, y1);
            rotation += step;

            let x2 = x + Math.cos(rotation) * innerRadius;
            let y2 = y + Math.sin(rotation) * innerRadius;
            ctx.lineTo(x2, y2);
            rotation += step;
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
        ctx.moveTo(x, y + this.size / 4);
        ctx.bezierCurveTo(
            x - this.size / 2, y - this.size / 2,
            x - this.size, y + this.size / 4,
            x, y + this.size
        );
        ctx.bezierCurveTo(
            x + this.size, y + this.size / 4,
            x + this.size / 2, y - this.size / 2,
            x, y + this.size / 4
        );
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}


// モジュールとしてエクスポート
export { Shape, Circle, Triangle, Square, Star, Heart };
