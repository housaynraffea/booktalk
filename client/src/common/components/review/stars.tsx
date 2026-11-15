import { useState, type MouseEvent } from "react";
import '@/common/styles/stars.css'

type Props = {
    value: number;
    onChange?: (value: number) => void;
    size?: number;
};

const Stars = ({ value, onChange, size = 30 }: Props) => {
    const [hover, setHover] = useState<number | null>(null);
    const shown = hover ?? value;

    function valueAt(event: MouseEvent<HTMLSpanElement>, star: number) {
        const rect = event.currentTarget.getBoundingClientRect();
        const isLeftHalf = event.clientX - rect.left < rect.width / 2;
        return Math.max(1, isLeftHalf ? star - 0.5 : star);
    }

    return (
        <span className="stars" role="img" aria-label={`${value} out of 5 stars`} onMouseLeave={() => setHover(null)}>
            {[1, 2, 3, 4, 5].map((star) => {
                const fill = Math.max(0, Math.min(1, shown - (star - 1)));
                return (
                    <span
                        key={star}
                        className={onChange ? 'star starInteractive' : 'star'}
                        style={{ fontSize: size }}
                        onMouseMove={onChange ? (e) => setHover(valueAt(e, star)) : undefined}
                        onClick={onChange ? (e) => onChange(valueAt(e, star)) : undefined}>
                        ★
                        <span className="starFill" style={{ width: `${fill*100}%` }}>
                            ★
                        </span>
                    </span>
                );
            })}
        </span>
    );
}

export default Stars;