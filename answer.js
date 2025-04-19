// 五角形
class Pentagon extends Shape {
    constructor(sizeMin, sizeMax, damping) {
        super(sizeMin, sizeMax, damping);
    }

    draw(ctx, x, y) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // 角の数
        const spikes = 5;
        // 描き始めの角度
        let rotation = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        
        // 上の角からスタート
        ctx.moveTo(x + Math.cos(rotation) * this.size, y + Math.sin(rotation) * this.size);
        for (let i = 0; i < spikes; i++) {
            rotation += step;

            rotation += step;
            let x2 = x + Math.cos(rotation) * this.size;
            let y2 = y + Math.sin(rotation) * this.size;
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
    }
}

// Pentagram クラス（五芒星）
class Pentagram extends Shape {
    constructor(sizeMin, sizeMax, damping) {
        super(sizeMin, sizeMax, damping);
    }

    draw(ctx, x, y) {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        // 角の数
        const spikes = 5;
        // 描き始めの角度
        let rotation = Math.PI / 2 * 3;
        let step = Math.PI / spikes * 4;
        
        // 上の角からスタート
        ctx.moveTo(x + Math.cos(rotation) * this.size, y + Math.sin(rotation) * this.size);
        for (let i = 0; i < spikes; i++) {
            rotation += step;
            let x2 = x + Math.cos(rotation) * this.size;
            let y2 = y + Math.sin(rotation) * this.size;
            ctx.lineTo(x2, y2);
        }
        ctx.arc(x, y, this.size, Math.PI / 2 * 3, Math.PI / 2 * 7, false);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// MagicCircle クラス（魔法陣）
class MagicCircle extends Shape {
    constructor(sizeMin, sizeMax, damping) {
        super(sizeMin, sizeMax, damping);
    }

    draw(ctx, x, y) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        
        // 同心円を描く
        for (let radius of [this.size, this.size * 0.8]) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        const spikes = 3;
        const step = Math.PI / spikes * 4;
        
        // 星形を描く関数
        const drawStar = (startRotation, radius) => {
            ctx.beginPath();
            let rotation = startRotation;
            ctx.moveTo(
                x + Math.cos(rotation) * radius, 
                y + Math.sin(rotation) * radius
            );
            
            for (let i = 0; i < spikes; i++) {
                rotation += step;
                const x2 = x + Math.cos(rotation) * radius;
                const y2 = y + Math.sin(rotation) * radius;
                ctx.lineTo(x2, y2);
            }
            ctx.closePath();
            ctx.stroke();
        };
        
        // 外側の星形
        drawStar(Math.PI / 2 * 3, this.size);
        drawStar(Math.PI / 2, this.size);
        
        // 内側の星形
        drawStar(Math.PI / 2 * 3, this.size / 2);
        drawStar(Math.PI / 2, this.size / 2);
        
        // 点と線のパターンを描く
        let rotation = Math.PI / 2 * 3;
        for (let i = 0; i < spikes; i++) {
            // 外側の小さな円を描く
            for (const angle of [rotation + step, rotation + step + Math.PI]) {
                ctx.beginPath();
                const x2 = x + Math.cos(angle) * this.size;
                const y2 = y + Math.sin(angle) * this.size;
                ctx.arc(x2, y2, this.size / 6, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // 外側の線を描く
            ctx.beginPath();
            const startAngle = rotation + step;
            let x1 = x + Math.cos(startAngle) * this.size;
            let y1 = y + Math.sin(startAngle) * this.size;
            ctx.moveTo(x1, y1);
            
            const endAngle = startAngle + Math.PI;
            let x2 = x + Math.cos(endAngle) * this.size;
            let y2 = y + Math.sin(endAngle) * this.size;
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            // 内側の小さな円を描く
            for (const angle of [rotation + step, rotation + step + Math.PI]) {
                ctx.beginPath();
                const x2 = x + Math.cos(angle) * this.size / 2;
                const y2 = y + Math.sin(angle) * this.size / 2;
                ctx.arc(x2, y2, this.size / 10, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            rotation += step * 2;
        }
        
        // 内側の細かい形状
        ctx.beginPath();
        rotation = Math.PI / 2 * 3;
        ctx.moveTo(
            x + Math.cos(rotation) * this.size / 2, 
            y + Math.sin(rotation) * this.size / 2
        );
        
        for (let i = 0; i < spikes * 2; i++) {
            rotation += step / 2;
            const x2 = x + Math.cos(rotation) * this.size / 2;
            const y2 = y + Math.sin(rotation) * this.size / 2;
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.stroke();
    }
}